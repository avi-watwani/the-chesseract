'use client';

import { useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { ChessBoardCore } from '../../components/chess/ChessBoardCore';
import { MoveHistory } from '../../components/chess/MoveHistory';
import { CapturedPieces } from '../../components/chess/CapturedPieces';
import { GameControls } from '../../components/chess/GameControls';
import { useBoardState } from '../../hooks/useBoardState';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useMoveHistory } from '../../hooks/useMoveHistory';
import { soundManager } from '../../utils/sounds';
import { Piece } from '../../types/chess';
import { RotateCcw } from 'lucide-react';

export default function AnalysisPage() {
  const { board, turn, selectedSquare, setSelectedSquare, makeMove, resetBoard, setBoard, setTurn } = useBoardState();
  const { calculateValidMoves, checkGameStatus } = useGameLogic(board, turn);
  const { moveHistory, addMove, canUndo, canRedo, undo, redo, reset: resetMoveHistory } = useMoveHistory();
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[], black: Piece[] }>({ white: [], black: [] });
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [boardHistory, setBoardHistory] = useState<any[]>([]);
  const [capturedHistory, setCapturedHistory] = useState<any[]>([]);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');

  useEffect(() => {
    if (soundManager) {
      soundManager.setEnabled(isSoundEnabled);
    }
  }, [isSoundEnabled]);

  const handleSquareClick = (position: string) => {
    if (selectedSquare === position) {
      setSelectedSquare(null);
      setValidMoves([]);
    } else if (selectedSquare) {
      if (validMoves.includes(position)) {
        handleMove(selectedSquare, position);
      }
      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      const [file, rank] = position.split('');
      const col = file.charCodeAt(0) - 97;
      const row = 8 - parseInt(rank);
      
      // In analysis mode, allow selecting pieces based on whose turn it is
      if (board[row][col].piece?.color === turn) {
        setSelectedSquare(position);
        setValidMoves(calculateValidMoves(position));
      }
    }
  };

  const handleMove = (from: string, to: string) => {
    const [fromFile, fromRank] = from.split('');
    const fromCol = fromFile.charCodeAt(0) - 97;
    const fromRow = 8 - parseInt(fromRank);
    const movingPiece = board[fromRow][fromCol].piece;

    if (!movingPiece) return;

    // Save current state to history
    setBoardHistory(prev => [...prev, JSON.parse(JSON.stringify(board))]);
    setCapturedHistory(prev => [...prev, JSON.parse(JSON.stringify(capturedPieces))]);

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
    const nextTurn = turn === 'white' ? 'black' : 'white';
    addMove(from, to, movingPiece, capturedPiece, board, nextTurn);
    
    // Check game status
    const status = checkGameStatus();
    if (status === 'checkmate') {
      soundManager?.playGameEnd();
    } else if (status === 'check') {
      soundManager?.playCheck();
    }
  };

  const handleReset = () => {
    resetBoard();
    resetMoveHistory();
    setCapturedPieces({ white: [], black: [] });
    setBoardHistory([]);
    setCapturedHistory([]);
    setSelectedSquare(null);
    setValidMoves([]);
  };

  const handleUndo = () => {
    if (canUndo() && boardHistory.length > 0) {
      const previousBoard = boardHistory[boardHistory.length - 1];
      const previousCaptured = capturedHistory[capturedHistory.length - 1];
      
      setBoard(previousBoard);
      setCapturedPieces(previousCaptured);
      setTurn(turn === 'white' ? 'black' : 'white');
      
      setBoardHistory(prev => prev.slice(0, -1));
      setCapturedHistory(prev => prev.slice(0, -1));
      
      undo();
    }
  };

  const handleFlipBoard = () => {
    setOrientation(prev => prev === 'white' ? 'black' : 'white');
  };

  return (
    <PageContainer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Flip Board Button - positioned absolutely */}
        <div className="fixed top-24 right-8 z-10">
          <button
            onClick={handleFlipBoard}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            Flip Board
          </button>
        </div>

        {/* Centered chess board */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
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
              orientation={orientation}
              isInteractive={true}
            />
          </div>

          {/* White captured pieces (below board) */}
          <div className="mt-2 w-full max-w-[512px] px-2">
            <CapturedPieces pieces={capturedPieces.white} color="white" board={board} />
          </div>

          {/* Move history and controls below board */}
          <div className="mt-8 flex gap-4 max-w-4xl">
            <MoveHistory moves={moveHistory} className="flex-1" />
            <GameControls
              mode="analysis"
              onReset={handleReset}
              onUndo={handleUndo}
              onRedo={() => {}} // Redo not fully implemented yet
              canUndo={canUndo()}
              canRedo={canRedo()}
              isSoundEnabled={isSoundEnabled}
              onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
