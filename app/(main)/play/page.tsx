'use client';

import { useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { ChessBoardCore } from '../../components/chess/ChessBoardCore';
import { MoveHistory } from '../../components/chess/MoveHistory';
import { CapturedPieces } from '../../components/chess/CapturedPieces';
import { GameControls } from '../../components/chess/GameControls';
import { useBoardState } from '../../hooks/useBoardState';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useSocketGame } from '../../hooks/useSocketGame';
import { useMoveHistory } from '../../hooks/useMoveHistory';
import { useArrows } from '../../hooks/useArrows';
import { soundManager } from '../../utils/sounds';
import { Clock, Users } from 'lucide-react';
import { Piece } from '../../types/chess';

export default function PlayPage() {
  const { socket, gameState, isPlayerTurn, setIsPlayerTurn, findGame, cancelSearch, makeSocketMove, offerDraw, resign, searchingForGame } = useSocketGame();
  const { board, selectedSquare, setSelectedSquare, makeMove, resetBoard } = useBoardState();
  const { calculateValidMoves, checkGameStatus } = useGameLogic(board, gameState.playerColor || 'white');
  const { moveHistory, addMove, reset: resetMoveHistory } = useMoveHistory();
  const { arrows, startDrawing, finishDrawing, clearArrows } = useArrows();
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[], black: Piece[] }>({ white: [], black: [] });
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [whiteTimeLeft, setWhiteTimeLeft] = useState(600); // 10 minutes - updated by server
  const [blackTimeLeft, setBlackTimeLeft] = useState(600); // 10 minutes - updated by server

  useEffect(() => {
    if (soundManager) {
      soundManager.setEnabled(isSoundEnabled);
    }
  }, [isSoundEnabled]);

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
      <div className="container mx-auto px-4 py-8">
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
            {/* Player info - positioned at top */}
            <div className="fixed top-24 left-8 z-10">
              <div className="bg-gray-900/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
                <span className="text-sm">Playing as: <span className="font-bold capitalize">{gameState.playerColor}</span></span>
                <span className="text-sm ml-4">vs <span className="font-bold">{gameState.opponentName}</span></span>
              </div>
            </div>

            {/* Centered chess board with clocks on the right */}
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
              {/* Chess board - centered */}
              <div className="flex flex-col items-center">
                {/* Black captured pieces (above board) */}
                <div className="mb-2 w-full max-w-[512px] px-2">
                  <CapturedPieces pieces={capturedPieces.black} color="black" board={board} />
                </div>

                <div className="glassmorphism p-6 rounded-xl">
                  <ChessBoardCore
                    board={board}
                    selectedSquare={selectedSquare}
                    validMoves={validMoves}
                    onSquareClick={handleSquareClick}
                    orientation={gameState.playerColor}
                    isInteractive={true}
                    arrows={arrows}
                    onSquareRightClick={startDrawing}
                    onSquareRightRelease={finishDrawing}
                  />
                </div>

                {/* White captured pieces (below board) */}
                <div className="mt-2 w-full max-w-[512px] px-2">
                  <CapturedPieces pieces={capturedPieces.white} color="white" board={board} />
                </div>
              </div>

              {/* Clocks positioned to the right of the board */}
              <div className="ml-8 flex flex-col gap-4">
                {/* Black player timer */}
                <div className={`backdrop-blur px-6 py-4 rounded-lg shadow-lg transition-all ${
                  gameState.playerColor === 'black' && isPlayerTurn 
                    ? 'bg-blue-600/90 ring-4 ring-blue-400 scale-105' 
                    : gameState.playerColor === 'white' && !isPlayerTurn
                    ? 'bg-blue-600/90 ring-4 ring-blue-400 scale-105'
                    : 'bg-gray-900/90'
                }`}>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-4xl">♚</div>
                    <div className="flex items-center gap-2">
                      <Clock className={blackTimeLeft < 60 ? 'text-red-400 w-5 h-5' : 'text-white w-5 h-5'} />
                      <span className={`text-2xl font-mono font-bold ${blackTimeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                        {formatTime(blackTimeLeft)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Black</div>
                  </div>
                </div>

                {/* White player timer */}
                <div className={`backdrop-blur px-6 py-4 rounded-lg shadow-lg transition-all ${
                  gameState.playerColor === 'white' && isPlayerTurn 
                    ? 'bg-blue-600/90 ring-4 ring-blue-400 scale-105' 
                    : gameState.playerColor === 'black' && !isPlayerTurn
                    ? 'bg-blue-600/90 ring-4 ring-blue-400 scale-105'
                    : 'bg-gray-900/90'
                }`}>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-4xl">♔</div>
                    <div className="flex items-center gap-2">
                      <Clock className={whiteTimeLeft < 60 ? 'text-red-400 w-5 h-5' : 'text-white w-5 h-5'} />
                      <span className={`text-2xl font-mono font-bold ${whiteTimeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                        {formatTime(whiteTimeLeft)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">White</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Move history and controls below board */}
            <div className="mt-8 flex justify-center gap-4 max-w-4xl mx-auto">
              <MoveHistory moves={moveHistory} className="flex-1" />
              <GameControls
                mode="play"
                onResign={handleResign}
                onDrawOffer={offerDraw}
                isSoundEnabled={isSoundEnabled}
                onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
              />
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
