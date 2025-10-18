import { useState, useEffect, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';

type GameState = {
  status: 'waiting' | 'playing' | 'ended';
  playerColor?: 'white' | 'black';
  opponentName?: string;
  gameId?: string;
};

type SocketGameHook = {
  socket: Socket | null;
  gameState: GameState;
  isPlayerTurn: boolean;
  setIsPlayerTurn: (turn: boolean) => void;
  findGame: () => void;
  cancelSearch: () => void;
  makeSocketMove: (from: string, to: string) => void;
  offerDraw: () => void;
  resign: () => void;
  searchingForGame: boolean;
};

export const useSocketGame = (): SocketGameHook => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState>({ status: 'waiting' });
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [searchingForGame, setSearchingForGame] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    console.log('Connecting to WebSocket server at:', socketUrl);
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      autoConnect: true
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected successfully to', socketUrl);
      setSocket(newSocket);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
      console.error('Make sure the server is running on port 3001');
      console.error('Run: cd server && npm run dev');
      setSearchingForGame(false);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setSearchingForGame(false);
    });

    newSocket.on('gameFound', ({ gameId, color, opponent }) => {
      console.log('Game found:', { gameId, color, opponent });
      setGameState({
        status: 'playing',
        playerColor: color,
        opponentName: opponent,
        gameId
      });
      setIsPlayerTurn(color === 'white');
      setSearchingForGame(false);
    });

    newSocket.on('gameEnded', ({ winner }) => {
      console.log('Game ended, winner:', winner);
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

  const findGame = useCallback(() => {
    if (socket && socket.connected) {
      setSearchingForGame(true);
      socket.emit('findGame');
    } else {
      console.error('Socket not connected');
      setSearchingForGame(false);
    }
  }, [socket]);

  const cancelSearch = useCallback(() => {
    if (socket && socket.connected) {
      setSearchingForGame(false);
      socket.emit('cancelSearch');
    }
  }, [socket]);

  const makeSocketMove = useCallback((from: string, to: string) => {
    if (socket && gameState.gameId) {
      socket.emit('makeMove', {
        gameId: gameState.gameId,
        from,
        to
      });
      setIsPlayerTurn(false);
    }
  }, [socket, gameState.gameId]);

  const offerDraw = useCallback(() => {
    if (socket && gameState.gameId) {
      socket.emit('drawOffer', { gameId: gameState.gameId });
    }
  }, [socket, gameState.gameId]);

  const resign = useCallback(() => {
    if (socket && gameState.gameId) {
      socket.emit('resign', { gameId: gameState.gameId });
      setGameState(prev => ({ ...prev, status: 'ended' }));
    }
  }, [socket, gameState.gameId]);

  return {
    socket,
    gameState,
    isPlayerTurn,
    setIsPlayerTurn,
    findGame,
    cancelSearch,
    makeSocketMove,
    offerDraw,
    resign,
    searchingForGame
  };
};

