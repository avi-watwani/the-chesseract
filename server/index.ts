import { Server } from 'socket.io';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

type Player = {
  id: string;
  name: string;
  socket: any;
  connected: boolean;
};

type Game = {
  id: string;
  white: Player;
  black: Player;
  moves: string[];
  whiteTime: number;  // seconds remaining
  blackTime: number;  // seconds remaining
  currentTurn: 'white' | 'black';
  status: 'waiting' | 'playing' | 'ended';
  timerInterval?: NodeJS.Timeout;
};

const waitingPlayers: Player[] = [];
const activeGames = new Map<string, Game>();

io.on('connection', (socket) => {
  // Add connection error handling
  io.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
  });

  socket.on('findGame', () => {
    const player: Player = {
      id: socket.id,
      name: `Player ${socket.id.slice(0, 4)}`,
      socket,
      connected: true
    };

    if (waitingPlayers.length > 0) {
      const opponent = waitingPlayers.shift()!;
      const gameId = uuidv4();
      
      // Randomly assign colors
      const [white, black] = Math.random() < 0.5 ? [player, opponent] : [opponent, player];
      
      const game: Game = {
        id: gameId,
        white,
        black,
        moves: [],
        whiteTime: 600,  // 10 minutes
        blackTime: 600,  // 10 minutes
        currentTurn: 'white',
        status: 'playing'
      };
      
      activeGames.set(gameId, game);

      // Notify players
      white.socket.emit('gameFound', {
        gameId,
        color: 'white',
        opponent: black.name
      });

      black.socket.emit('gameFound', {
        gameId,
        color: 'black',
        opponent: white.name
      });

      // Start the timer for this game
      startGameTimer(gameId);
    } else {
      waitingPlayers.push(player);
    }
  });

  socket.on('cancelSearch', () => {
    const index = waitingPlayers.findIndex(p => p.id === socket.id);
    if (index !== -1) {
      waitingPlayers.splice(index, 1);
    }
  });

  socket.on('makeMove', ({ gameId, from, to }) => {
    const game = activeGames.get(gameId);
    if (!game) return;

    const isWhite = game.white.id === socket.id;
    const opponent = isWhite ? game.black : game.white;

    // Verify it's the player's turn
    if ((isWhite && game.currentTurn !== 'white') || (!isWhite && game.currentTurn !== 'black')) {
      return; // Not your turn
    }

    game.moves.push(`${from}-${to}`);
    
    // Switch turn (this automatically switches which timer counts down)
    game.currentTurn = game.currentTurn === 'white' ? 'black' : 'white';
    
    // Notify opponent of the move
    opponent.socket.emit('moveMade', { from, to });
  });

  socket.on('resign', ({ gameId }) => {
    const game = activeGames.get(gameId);
    if (!game) return;

    const isWhite = game.white.id === socket.id;
    const winner = isWhite ? 'black' : 'white';

    endGame(gameId, winner, 'resignation');
  });

  socket.on('drawOffer', ({ gameId }) => {
    const game = activeGames.get(gameId);
    if (!game) return;

    const isWhite = game.white.id === socket.id;
    const opponent = isWhite ? game.black : game.white;

    opponent.socket.emit('drawOffered');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Remove from waiting players
    const waitingIndex = waitingPlayers.findIndex(p => p.id === socket.id);
    if (waitingIndex !== -1) {
      waitingPlayers.splice(waitingIndex, 1);
    }

    // Handle active games - TIMER KEEPS RUNNING
    for (const [gameId, game] of activeGames.entries()) {
      if (game.white.id === socket.id) {
        game.white.connected = false;
        game.black.socket.emit('opponentDisconnected', {
          timeRemaining: game.whiteTime
        });
        console.log(`White player disconnected from game ${gameId}, timer continues...`);
      } else if (game.black.id === socket.id) {
        game.black.connected = false;
        game.white.socket.emit('opponentDisconnected', {
          timeRemaining: game.blackTime
        });
        console.log(`Black player disconnected from game ${gameId}, timer continues...`);
      }
    }
  });
});

// Timer management functions
function startGameTimer(gameId: string) {
  const game = activeGames.get(gameId);
  if (!game) return;

  console.log(`Starting timer for game ${gameId}`);

  // Clear any existing interval
  if (game.timerInterval) {
    clearInterval(game.timerInterval);
  }

  // Update timer every second
  game.timerInterval = setInterval(() => {
    updateGameTimer(gameId);
  }, 1000);
}

function updateGameTimer(gameId: string) {
  const game = activeGames.get(gameId);
  if (!game || game.status !== 'playing') return;

  // Decrement the active player's time
  if (game.currentTurn === 'white') {
    game.whiteTime--;
  } else {
    game.blackTime--;
  }

  // Check for timeout
  if (game.whiteTime <= 0) {
    endGame(gameId, 'black', 'timeout');
    return;
  }
  if (game.blackTime <= 0) {
    endGame(gameId, 'white', 'timeout');
    return;
  }

  // Broadcast timer update to both players
  const timerUpdate = {
    whiteTime: game.whiteTime,
    blackTime: game.blackTime
  };

  if (game.white.connected) {
    game.white.socket.emit('timerUpdate', timerUpdate);
  }
  if (game.black.connected) {
    game.black.socket.emit('timerUpdate', timerUpdate);
  }
}

function endGame(gameId: string, winner: 'white' | 'black' | 'draw', reason: string) {
  const game = activeGames.get(gameId);
  if (!game) return;

  console.log(`Game ${gameId} ended. Winner: ${winner}, Reason: ${reason}`);

  // Stop the timer
  if (game.timerInterval) {
    clearInterval(game.timerInterval);
  }

  game.status = 'ended';

  // Notify both players
  const endMessage = {
    winner,
    reason
  };

  if (reason === 'timeout') {
    const loser = winner === 'white' ? 'black' : 'white';
    const timeoutMessage = {
      winner,
      loser,
      reason: 'timeout'
    };

    if (game.white.connected) {
      game.white.socket.emit('timeoutLoss', timeoutMessage);
      game.white.socket.emit('gameEnded', endMessage);
    }
    if (game.black.connected) {
      game.black.socket.emit('timeoutLoss', timeoutMessage);
      game.black.socket.emit('gameEnded', endMessage);
    }
  } else {
    if (game.white.connected) {
      game.white.socket.emit('gameEnded', endMessage);
    }
    if (game.black.connected) {
      game.black.socket.emit('gameEnded', endMessage);
    }
  }

  // Clean up after 30 seconds
  setTimeout(() => {
    activeGames.delete(gameId);
    console.log(`Game ${gameId} cleaned up`);
  }, 30000);
}

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
}); 