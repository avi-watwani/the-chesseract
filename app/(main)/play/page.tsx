'use client';

import { useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { ChessBoardCore } from '../../components/chess/ChessBoardCore';
import { MoveHistory } from '../../components/chess/MoveHistory';
import { CapturedPieces } from '../../components/chess/CapturedPieces';
import { useBoardState } from '../../hooks/useBoardState';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useSocketGame } from '../../hooks/useSocketGame';
import { useMoveHistory } from '../../hooks/useMoveHistory';
import { useArrows } from '../../hooks/useArrows';
import { soundManager } from '../../utils/sounds';
import { Clock, Users, Flag, Scale } from 'lucide-react';
import { Piece } from '../../types/chess';
import { createClient } from '../../utils/supabase/client';

export default function PlayPage() {
  const [username, setUsername] = useState<string>('');
  const supabase = createClient();
  
  // Fetch the logged-in user's username
  useEffect(() => {
    const fetchUsername = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUsername(profile.username);
        }
      }
    };
    fetchUsername();
  }, [supabase]);

  const { socket, gameState, isPlayerTurn, setIsPlayerTurn, findGame, cancelSearch, makeSocketMove, offerDraw, resign, searchingForGame } = useSocketGame(username);
  const { board, selectedSquare, setSelectedSquare, makeMove, resetBoard } = useBoardState();
  const { calculateValidMoves, checkGameStatus } = useGameLogic(board, gameState.playerColor || 'white');
  const { moveHistory, addMove, reset: resetMoveHistory } = useMoveHistory();
  const { arrows, startDrawing, finishDrawing, clearArrows } = useArrows();
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[], black: Piece[] }>({ white: [], black: [] });
  const [whiteTimeLeft, setWhiteTimeLeft] = useState(600); // 10 minutes - updated by server
  const [blackTimeLeft, setBlackTimeLeft] = useState(600); // 10 minutes - updated by server

  // Listen for game state sync after reconnection
  useEffect(() => {
    const handleGameStateSync = (event: any) => {
      const { whiteTime, blackTime, currentTurn, moves, boardState } = event.detail;
      
      console.log('Game state sync received:', { whiteTime, blackTime, currentTurn, moves });
      
      // Restore timer values
      setWhiteTimeLeft(whiteTime);
      setBlackTimeLeft(blackTime);
      
      // Replay all moves to restore board state
      if (moves && moves.length > 0) {
        // Reset to initial state
        resetBoard();
        resetMoveHistory();
        setCapturedPieces({ white: [], black: [] });
        
        // Replay all moves synchronously
        replayMoves(moves);
      }
      
      console.log('Board state restoration initiated');
    };
    
    window.addEventListener('gameStateSync', handleGameStateSync);
    
    return () => {
      window.removeEventListener('gameStateSync', handleGameStateSync);
    };
  }, []);

  // Function to replay moves synchronously
  const replayMoves = (moves: string[]) => {
    console.log(`Replaying ${moves.length} moves to restore board state...`);
    
    // Replay all moves - they will execute in order due to functional state updates
    moves.forEach((move: string, index: number) => {
      const [from, to] = move.split('-');
      makeMove(from, to);
      console.log(`Replayed move ${index + 1}/${moves.length}: ${from}-${to}`);
    });
    
    console.log('All moves replayed successfully');
  };

  // Listen for socket events (opponent moves, timer updates, game end)
  useEffect(() => {
    if (!socket || !gameState.gameId) return;

    const handleOpponentMove = ({ from, to }: { from: string; to: string }) => {
      const [fromFile, fromRank] = from.split('');
      const fromCol = fromFile.charCodeAt(0) - 97;
      const fromRow = 8 - parseInt(fromRank);
      const movingPiece = board[fromRow][fromCol].piece;

      if (movingPiece) {
        const capturedPiece = makeMove(from, to);
        
        if (capturedPiece) {
          const capturingColor = capturedPiece.color === 'white' ? 'black' : 'white';
          setCapturedPieces(prev => ({
            ...prev,
            [capturingColor]: [...prev[capturingColor], capturedPiece]
          }));
          soundManager?.playCapture();
        } else {
          soundManager?.playMove();
        }

        // Add move to history
        addMove(from, to, movingPiece, capturedPiece, board, gameState.playerColor === 'white' ? 'white' : 'black');
        
        // Check game status
        const status = checkGameStatus();
        if (status === 'checkmate') {
          soundManager?.playGameEnd();
        } else if (status === 'check') {
          soundManager?.playCheck();
        }
      }
      
      setIsPlayerTurn(true);
    };

    // Listen for timer updates from server
    const handleTimerUpdate = ({ whiteTime, blackTime }: { whiteTime: number; blackTime: number }) => {
      setWhiteTimeLeft(whiteTime);
      setBlackTimeLeft(blackTime);
    };

    // Listen for game end due to timeout
    const handleTimeoutLoss = ({ winner, loser }: { winner: string; loser: string }) => {
      soundManager?.playGameEnd();
      alert(`Time's up! ${winner} wins by timeout.`);
    };

    socket.on('moveMade', handleOpponentMove);
    socket.on('timerUpdate', handleTimerUpdate);
    socket.on('timeoutLoss', handleTimeoutLoss);

    return () => {
      socket.off('moveMade', handleOpponentMove);
      socket.off('timerUpdate', handleTimerUpdate);
      socket.off('timeoutLoss', handleTimeoutLoss);
    };
  }, [socket, gameState.gameId, board, makeMove, addMove, checkGameStatus, setIsPlayerTurn, gameState.playerColor]);

  const handleSquareClick = (position: string) => {
    if (!isPlayerTurn || gameState.status !== 'playing') return;

    // Clear arrows on left click
    if (arrows.length > 0) {
      clearArrows();
    }

    if (selectedSquare === position) {
      setSelectedSquare(null);
      setValidMoves([]);
    } else if (selectedSquare) {
      if (validMoves.includes(position)) {
        handlePlayerMove(selectedSquare, position);
      }
      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      const [file, rank] = position.split('');
      const col = file.charCodeAt(0) - 97;
      const row = 8 - parseInt(rank);
      
      if (board[row][col].piece?.color === gameState.playerColor) {
        setSelectedSquare(position);
        setValidMoves(calculateValidMoves(position));
      }
    }
  };

  const handlePlayerMove = (from: string, to: string) => {
    const [fromFile, fromRank] = from.split('');
    const fromCol = fromFile.charCodeAt(0) - 97;
    const fromRow = 8 - parseInt(fromRank);
    const movingPiece = board[fromRow][fromCol].piece;

    if (!movingPiece) return;

    const capturedPiece = makeMove(from, to);
    
    if (capturedPiece) {
      const capturingColor = capturedPiece.color === 'white' ? 'black' : 'white';
      setCapturedPieces(prev => ({
        ...prev,
        [capturingColor]: [...prev[capturingColor], capturedPiece]
      }));
      soundManager?.playCapture();
    } else {
      soundManager?.playMove();
    }

    // Add move to history
    const nextTurn = gameState.playerColor === 'white' ? 'black' : 'white';
    addMove(from, to, movingPiece, capturedPiece, board, nextTurn);
    
    // Emit socket event
    makeSocketMove(from, to);
    
    // Check game status
    const status = checkGameStatus();
    if (status === 'checkmate') {
      soundManager?.playGameEnd();
    } else if (status === 'check') {
      soundManager?.playCheck();
    }
  };

  const handlePieceDrop = (piece: Piece, position: string, sourcePosition?: string) => {
    // Only handle drops from board pieces when it's player's turn
    if (!sourcePosition || !isPlayerTurn || gameState.status !== 'playing') return;

    // Check if this is a valid move
    const moves = calculateValidMoves(sourcePosition);
    if (moves.includes(position)) {
      handlePlayerMove(sourcePosition, position);
    }
  };

  const handleResign = () => {
    resign();
    soundManager?.playGameEnd();
  };

  const handleNewGame = () => {
    resetBoard();
    resetMoveHistory();
    setCapturedPieces({ white: [], black: [] });
    setWhiteTimeLeft(600);
    setBlackTimeLeft(600);
    findGame();
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <PageContainer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-2">
        {gameState.status === 'waiting' && (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
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
          </div>
        )}

        {gameState.status === 'playing' && (
          <div>
            {/* Opponent disconnection notification */}
            {gameState.opponentDisconnected && (
              <div className="fixed top-20 right-8 z-10">
                <div className="bg-yellow-600/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg animate-pulse">
                  <span className="text-sm font-semibold">⚠️ Opponent disconnected</span>
                  <span className="text-xs ml-2">(60s grace period)</span>
                </div>
              </div>
            )}

            {/* Reconnecting notification */}
            {gameState.reconnecting && (
              <div className="fixed top-20 right-8 z-10">
                <div className="bg-blue-600/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
                  <span className="text-sm font-semibold">🔄 Reconnecting to game...</span>
                </div>
              </div>
            )}

            {/* Board and sidebar layout */}
            <div className="flex items-center justify-center gap-6 h-[calc(100vh-120px)]">
              {/* Chess board on the left */}
              <div className="flex flex-col items-center">
                {/* Chess board */}
                <div className="glassmorphism p-3 rounded-xl">
                  <div className="w-[520px] h-[520px]">
                    <ChessBoardCore
                      board={board}
                      selectedSquare={selectedSquare}
                      validMoves={validMoves}
                      onSquareClick={handleSquareClick}
                      orientation={gameState.playerColor}
                      isInteractive={true}
                      onPieceDrop={handlePieceDrop}
                      isDraggable={true}
                      arrows={arrows}
                      onSquareRightClick={startDrawing}
                      onSquareRightRelease={finishDrawing}
                    />
                  </div>
                </div>
              </div>

              {/* Right sidebar with timers and move history */}
              <div className="flex flex-col h-[520px] w-[300px]">
                {/* Opponent's timer */}
                <div className={`backdrop-blur px-4 py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-between ${
                  !isPlayerTurn
                    ? 'bg-blue-600/90 ring-2 ring-blue-400' 
                    : 'bg-gray-800/90'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="text-xl">{gameState.playerColor === 'white' ? '♚' : '♔'}</div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs">{gameState.opponentName}</span>
                    </div>
                  </div>
                  <div className={`backdrop-blur px-2.5 py-1 rounded ${
                    !isPlayerTurn ? 'bg-white/20' : 'bg-black/30'
                  }`}>
                    <div className="flex items-center gap-1">
                      <Clock className={
                        (gameState.playerColor === 'white' ? blackTimeLeft : whiteTimeLeft) < 60 
                          ? 'text-red-400 w-3.5 h-3.5' 
                          : 'text-white w-3.5 h-3.5'
                      } />
                      <span className={`text-base font-mono font-bold ${
                        (gameState.playerColor === 'white' ? blackTimeLeft : whiteTimeLeft) < 60 
                          ? 'text-red-400' 
                          : 'text-white'
                      }`}>
                        {formatTime(gameState.playerColor === 'white' ? blackTimeLeft : whiteTimeLeft)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Opponent's captured pieces */}
                <div className="mt-1.5">
                  <CapturedPieces 
                    pieces={gameState.playerColor === 'white' ? capturedPieces.black : capturedPieces.white} 
                    color={gameState.playerColor === 'white' ? 'black' : 'white'} 
                    board={board} 
                  />
                </div>

                {/* Move history - fills remaining space */}
                <div className="flex-1 mt-3 mb-3 overflow-hidden">
                  <MoveHistory moves={moveHistory} className="h-full" />
                </div>

                {/* Game action buttons */}
                <div className="mb-3 flex gap-2">
                  <button
                    onClick={handleResign}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors text-sm font-medium"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Resign
                  </button>
                  <button
                    onClick={offerDraw}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-colors text-sm font-medium"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    Draw
                  </button>
                </div>

                {/* Player's captured pieces */}
                <div className="mb-1.5">
                  <CapturedPieces 
                    pieces={gameState.playerColor === 'white' ? capturedPieces.white : capturedPieces.black} 
                    color={gameState.playerColor === 'white' ? 'white' : 'black'} 
                    board={board} 
                  />
                </div>

                {/* Player's timer */}
                <div className={`backdrop-blur px-4 py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-between ${
                  isPlayerTurn
                    ? 'bg-blue-600/90 ring-2 ring-blue-400' 
                    : 'bg-gray-800/90'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="text-xl">{gameState.playerColor === 'white' ? '♔' : '♚'}</div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs">You</span>
                    </div>
                  </div>
                  <div className={`backdrop-blur px-2.5 py-1 rounded ${
                    isPlayerTurn ? 'bg-white/20' : 'bg-black/30'
                  }`}>
                    <div className="flex items-center gap-1">
                      <Clock className={
                        (gameState.playerColor === 'white' ? whiteTimeLeft : blackTimeLeft) < 60 
                          ? 'text-red-400 w-3.5 h-3.5' 
                          : 'text-white w-3.5 h-3.5'
                      } />
                      <span className={`text-base font-mono font-bold ${
                        (gameState.playerColor === 'white' ? whiteTimeLeft : blackTimeLeft) < 60 
                          ? 'text-red-400' 
                          : 'text-white'
                      }`}>
                        {formatTime(gameState.playerColor === 'white' ? whiteTimeLeft : blackTimeLeft)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState.status === 'ended' && (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Game Over</h2>
              <button
                onClick={handleNewGame}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
