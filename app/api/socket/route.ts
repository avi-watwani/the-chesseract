import { Server } from 'socket.io';
import { NextRequest, NextResponse } from 'next/server';
import { Server as NetServer } from 'http';
import { GameState, GameEndEvent } from '@/app/types/game';

// Initialize Socket.IO server
let io: Server;

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  if (!(req as any).socket?.server?.io) {
    console.log('Initializing Socket.IO server...');
    const httpServer: NetServer = (req as any).socket.server as any;
    io = new Server(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    // Game state management
    const games = new Map<string, GameState>();

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('joinGame', ({ gameId, playerColor }) => {
        console.log(`Player ${playerColor} joined game ${gameId}`);
        socket.join(gameId);
        
        if (!games.has(gameId)) {
          games.set(gameId, {
            players: new Map(),
            currentTurn: 'white',
            moves: [],
            status: 'waiting'
          });
        }

        const game = games.get(gameId)!;
        game.players.set(socket.id, playerColor);

        if (game.players.size === 2) {
          game.status = 'playing';
          io.to(gameId).emit('gameStart', { gameId });
        }
      });

      socket.on('makeMove', ({ gameId, from, to }) => {
        const game = games.get(gameId);
        if (!game) return;

        const playerColor = game.players.get(socket.id);
        if (playerColor !== game.currentTurn) return;

        game.moves.push({ from, to, player: playerColor });
        game.currentTurn = playerColor === 'white' ? 'black' : 'white';

        socket.to(gameId).emit('moveMade', { from, to });
      });

      socket.on('resign', ({ gameId }) => {
        const game = games.get(gameId);
        if (!game) return;

        const playerColor = game.players.get(socket.id);
        if (!playerColor) return;

        game.status = 'resigned';
        io.to(gameId).emit('gameEnd', {
          type: 'resignation',
          winner: playerColor === 'white' ? 'black' : 'white'
        });
      });

      socket.on('drawOffer', ({ gameId }) => {
        const game = games.get(gameId);
        if (!game) return;

        const playerColor = game.players.get(socket.id);
        if (!playerColor) return;

        socket.to(gameId).emit('drawOffered', { from: playerColor });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        // Clean up game state if needed
      });
    });

    (req as any).socket.server.io = io;
  }

  return NextResponse.json({ success: true });
} 