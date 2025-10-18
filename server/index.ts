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
  userId: string; // persistent identifier across reconnections
  name: string;
  socket: any;
  connected: boolean;
  disconnectTime?: number; // timestamp when disconnected
  disconnectTimeout?: NodeJS.Timeout; // 60s timeout reference
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
  boardState?: string; // FEN string for game position sync
};

const waitingPlayers: Player[] = [];
const activeGames = new Map<string, Game>();
const userGameMap = new Map<string, string>(); // userId -> gameId mapping

io.on('connection', (socket) => {
  // Add connection error handling
  io.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
  });

  socket.on('findGame', (data) => {
    const userId = data?.userId || socket.id; // fallback to socket.id if no userId provided
    const player: Player = {
      id: socket.id,
      userId,
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

      // Track users in this game
      userGameMap.set(white.userId, gameId);
      userGameMap.set(black.userId, gameId);

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

  // Handle reconnection to existing game
  socket.on('rejoinGame', (data) => {
    const userId = data?.userId;
    const gameId = data?.gameId;
    
    if (!userId || !gameId) {
      socket.emit('rejoinFailed', { reason: 'Missing userId or gameId' });
      return;
    }
    
    console.log(`Rejoin attempt - userId: ${userId}, gameId: ${gameId}`);
    
    const game = activeGames.get(gameId);
    if (!game) {
      socket.emit('rejoinFailed', { reason: 'Game not found' });
      return;
    }

    // Check if game has ended
    if (game.status === 'ended') {
      socket.emit('rejoinFailed', { reason: 'Game already ended' });
      return;
    }

    // Find which player is reconnecting
    let playerColor: 'white' | 'black' | null = null;
    if (game.white.userId === userId) {
      playerColor = 'white';
    } else if (game.black.userId === userId) {
      playerColor = 'black';
    } else {
      socket.emit('rejoinFailed', { reason: 'Not a player in this game' });
      return;
    }

    const player = playerColor === 'white' ? game.white : game.black;
    const opponent = playerColor === 'white' ? game.black : game.white;

    // Cancel disconnection timeout
    if (player.disconnectTimeout) {
      clearTimeout(player.disconnectTimeout);
      player.disconnectTimeout = undefined;
    }

    // Update player connection
    player.id = socket.id;
    player.socket = socket;
    player.connected = true;
    player.disconnectTime = undefined;

    console.log(`${playerColor} player reconnected to game ${gameId}`);

    // Send game state to reconnecting player
    socket.emit('gameRejoined', {
      gameId,
      color: playerColor,
      opponent: opponent.name,
      whiteTime: game.whiteTime,
      blackTime: game.blackTime,
      currentTurn: game.currentTurn,
      moves: game.moves,
      boardState: game.boardState
    });

    // Notify opponent of reconnection
    if (opponent.connected) {
      opponent.socket.emit('opponentReconnected', {
        playerColor
      });
    }
  });

  socket.on('makeMove', (data) => {
    const gameId = data?.gameId;
    const from = data?.from;
    const to = data?.to;
    const boardState = data?.boardState;
    
    if (!gameId || !from || !to) return;
    
    const game = activeGames.get(gameId);
    if (!game) return;

    const isWhite = game.white.id === socket.id;
    const opponent = isWhite ? game.black : game.white;

    // Verify it's the player's turn
    if ((isWhite && game.currentTurn !== 'white') || (!isWhite && game.currentTurn !== 'black')) {
      return; // Not your turn
    }

    game.moves.push(`${from}-${to}`);
    
    // Store board state for reconnection sync
    if (boardState) {
      game.boardState = boardState;
    }
    
    // Switch turn (this automatically switches which timer counts down)
    game.currentTurn = game.currentTurn === 'white' ? 'black' : 'white';
    
    // Notify opponent of the move
    opponent.socket.emit('moveMade', { from, to });
  });

  socket.on('resign', (data) => {
    const gameId = data?.gameId;
    if (!gameId) return;
    
    const game = activeGames.get(gameId);
    if (!game) return;

    const isWhite = game.white.id === socket.id;
    const winner = isWhite ? 'black' : 'white';

    endGame(gameId, winner, 'resignation');
  });

  socket.on('drawOffer', (data) => {
    const gameId = data?.gameId;
    if (!gameId) return;
    
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

    // Handle active games - Start 60-second grace period
    for (const [gameId, game] of activeGames.entries()) {
      if (game.white.id === socket.id) {
        handlePlayerDisconnect(gameId, game, 'white');
      } else if (game.black.id === socket.id) {
        handlePlayerDisconnect(gameId, game, 'black');
      }
    }
  });
});

// Disconnection handling with 60-second grace period
function handlePlayerDisconnect(gameId: string, game: Game, playerColor: 'white' | 'black') {
  const player = playerColor === 'white' ? game.white : game.black;
  const opponent = playerColor === 'white' ? game.black : game.white;

  player.connected = false;
  player.disconnectTime = Date.now();

  console.log(`${playerColor} player disconnected from game ${gameId}, starting 60s grace period...`);

  // Notify opponent
  opponent.socket.emit('opponentDisconnected', {
    playerColor,
    gracePeriodSeconds: 60
  });

  // Start 60-second countdown
  player.disconnectTimeout = setTimeout(() => {
    handleDisconnectTimeout(gameId, playerColor);
  }, 60000);
}

function handleDisconnectTimeout(gameId: string, disconnectedPlayerColor: 'white' | 'black') {
  const game = activeGames.get(gameId);
  if (!game) return;

  const disconnectedPlayer = disconnectedPlayerColor === 'white' ? game.white : game.black;
  
  // Check if player reconnected during grace period
  if (disconnectedPlayer.connected) {
    console.log(`Player reconnected during grace period, timeout cancelled`);
    return;
  }

  console.log(`Grace period expired for ${disconnectedPlayerColor} in game ${gameId}`);
  
  // Declare opponent as winner
  const winner = disconnectedPlayerColor === 'white' ? 'black' : 'white';
  endGame(gameId, winner, 'disconnection');
}

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

  // Clear any disconnect timeouts
  if (game.white.disconnectTimeout) {
    clearTimeout(game.white.disconnectTimeout);
  }
  if (game.black.disconnectTimeout) {
    clearTimeout(game.black.disconnectTimeout);
  }

  // Remove from userGameMap
  userGameMap.delete(game.white.userId);
  userGameMap.delete(game.black.userId);

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