import { Server } from 'socket.io';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

type Player = {
  id: string;
  name: string;
  socket: any;
};

type Game = {
  id: string;
  white: Player;
  black: Player;
  moves: string[];
};

const waitingPlayers: Player[] = [];
const activeGames = new Map<string, Game>();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('findGame', () => {
    const player: Player = {
      id: socket.id,
      name: `Player ${socket.id.slice(0, 4)}`,
      socket
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
        moves: []
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

    game.moves.push(`${from}-${to}`);
    opponent.socket.emit('moveMade', { from, to });
  });

  socket.on('disconnect', () => {
    // Remove from waiting players
    const waitingIndex = waitingPlayers.findIndex(p => p.id === socket.id);
    if (waitingIndex !== -1) {
      waitingPlayers.splice(waitingIndex, 1);
    }

    // Handle active games
    for (const [gameId, game] of activeGames.entries()) {
      if (game.white.id === socket.id || game.black.id === socket.id) {
        const opponent = game.white.id === socket.id ? game.black : game.white;
        opponent.socket.emit('gameEnded', { reason: 'opponent-disconnected' });
        activeGames.delete(gameId);
      }
    }
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
}); 