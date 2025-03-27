'use client';

import { useState, useEffect } from 'react';
import ChessBoard from './ChessBoard';
import { Socket, io } from 'socket.io-client';
import { Clock, Users } from 'lucide-react';

type GameState = {
  status: 'waiting' | 'playing' | 'ended';
  playerColor?: 'white' | 'black';
  opponentName?: string;
  timeLeft?: number;
  gameId?: string;
};

export default function PlayChess() {
  const [gameState, setGameState] = useState<GameState>({ status: 'waiting' });
  const [socket, setSocket] = useState<Socket | null>(null);
  const [searchingForGame, setSearchingForGame] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    newSocket.on('connect', () => {
      setSocket(newSocket);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setSearchingForGame(false);
    });

    newSocket.on('disconnect', (reason) => {
      setSearchingForGame(false);
    });

    newSocket.on('gameFound', ({ gameId, color, opponent }) => {
      setGameState({
        status: 'playing',
        playerColor: color,
        opponentName: opponent,
        gameId,
        timeLeft: 600
      });
      setSearchingForGame(false);
    });

    newSocket.on('gameEnded', ({ winner }) => {
      setGameState(prev => ({
        ...prev,
        status: 'ended'
      }));
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const findGame = () => {
    if (socket && socket.connected) {
      setSearchingForGame(true);
      socket.emit('findGame');
    } else {
      console.error('Socket not connected');
      setSearchingForGame(false);
    }
  };

  const cancelSearch = () => {
    if (socket && socket.connected) {
      setSearchingForGame(false);
      socket.emit('cancelSearch');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {gameState.status === 'waiting' && (
        <div className="text-center mb-8">
          {!searchingForGame ? (
            <button
              onClick={findGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Find a Game
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Users className="animate-pulse text-blue-400" />
                <span className="text-lg">Searching for opponent...</span>
              </div>
              <button
                onClick={cancelSearch}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {gameState.status === 'playing' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-lg">Playing as: {gameState.playerColor}</span>
              <span className="text-lg">Opponent: {gameState.opponentName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-blue-400" />
              <span className="text-lg">{Math.floor(gameState.timeLeft! / 60)}:{(gameState.timeLeft! % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
          
          <div className="glassmorphism p-6 rounded-xl">
            <ChessBoard 
              socket={socket!}
              gameId={gameState.gameId!}
              playerColor={gameState.playerColor!}
            />
          </div>
        </div>
      )}

      {gameState.status === 'ended' && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Game Over</h2>
          <button
            onClick={() => setGameState({ status: 'waiting' })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
} 