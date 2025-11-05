import { useState, useEffect, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';

type GameState = {
  status: 'waiting' | 'playing' | 'ended';
  playerColor?: 'white' | 'black';
  opponentName?: string;
  gameId?: string;
  opponentDisconnected?: boolean;
  reconnecting?: boolean;
};

type SocketGameHook = {
  socket: Socket | null;
  gameState: GameState;
  isPlayerTurn: boolean;
  setIsPlayerTurn: (turn: boolean) => void;
  findGame: () => void;
  cancelSearch: () => void;
  makeSocketMove: (from: string, to: string, boardState?: string) => void;
  offerDraw: () => void;
  resign: () => void;
  searchingForGame: boolean;
};

// Generate or retrieve persistent userId
function getUserId(): string {
  if (typeof window === 'undefined') return '';
  
  let userId = localStorage.getItem('chesseract_userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chesseract_userId', userId);
  }
  return userId;
}

export const useSocketGame = (username: string): SocketGameHook => {
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

      // Try to rejoin game if we have one in localStorage
      const userId = getUserId();
      const storedGameId = localStorage.getItem('chesseract_gameId');
      const storedColor = localStorage.getItem('chesseract_playerColor');
      
      if (userId && storedGameId && storedColor) {
        console.log('Attempting to rejoin game:', storedGameId);
        setGameState(prev => ({ ...prev, reconnecting: true }));
        newSocket.emit('rejoinGame', { userId, gameId: storedGameId });
      }
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
      
      // Store game info in localStorage
      localStorage.setItem('chesseract_gameId', gameId);
      localStorage.setItem('chesseract_playerColor', color);
      
      setGameState({
        status: 'playing',
        playerColor: color,
        opponentName: opponent,
        gameId,
        opponentDisconnected: false
      });
      setIsPlayerTurn(color === 'white');
      setSearchingForGame(false);
    });

    newSocket.on('gameRejoined', ({ gameId, color, opponent, whiteTime, blackTime, currentTurn, moves, boardState }) => {
      console.log('Successfully rejoined game:', gameId);
      
      setGameState({
        status: 'playing',
        playerColor: color,
        opponentName: opponent,
        gameId,
        opponentDisconnected: false,
        reconnecting: false
      });
      setIsPlayerTurn(color === currentTurn);
      
      // Emit event for board state sync (can be caught by parent component)
      window.dispatchEvent(new CustomEvent('gameStateSync', {
        detail: { whiteTime, blackTime, currentTurn, moves, boardState }
      }));
    });

    newSocket.on('rejoinFailed', ({ reason }) => {
      console.log('Failed to rejoin game:', reason);
      // Clear localStorage
      localStorage.removeItem('chesseract_gameId');
      localStorage.removeItem('chesseract_playerColor');
      setGameState({ status: 'waiting', reconnecting: false });
    });

    newSocket.on('opponentDisconnected', ({ playerColor, gracePeriodSeconds }) => {
      console.log(`Opponent (${playerColor}) disconnected. Grace period: ${gracePeriodSeconds}s`);
      setGameState(prev => ({
        ...prev,
        opponentDisconnected: true
      }));
    });

    newSocket.on('opponentReconnected', ({ playerColor }) => {
      console.log(`Opponent (${playerColor}) reconnected!`);
      setGameState(prev => ({
        ...prev,
        opponentDisconnected: false
      }));
    });

    newSocket.on('gameEnded', ({ winner, reason }) => {
      console.log('Game ended, winner:', winner, 'reason:', reason);
      
      // Clear localStorage
      localStorage.removeItem('chesseract_gameId');
      localStorage.removeItem('chesseract_playerColor');
      
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
      const userId = getUserId();
      socket.emit('findGame', { userId, username: username || 'Anonymous' });
    } else {
      console.error('Socket not connected');
      setSearchingForGame(false);
    }
  }, [socket, username]);

  const cancelSearch = useCallback(() => {
    if (socket && socket.connected) {
      setSearchingForGame(false);
      socket.emit('cancelSearch');
    }
  }, [socket]);

  const makeSocketMove = useCallback((from: string, to: string, boardState?: string) => {
    if (socket && gameState.gameId) {
      socket.emit('makeMove', {
        gameId: gameState.gameId,
        from,
        to,
        boardState
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
      
      // Clear localStorage
      localStorage.removeItem('chesseract_gameId');
      localStorage.removeItem('chesseract_playerColor');
      
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

