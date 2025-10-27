'use client';

import { useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { ChessBoardCore } from '../../components/chess/ChessBoardCore';
import { MoveHistory } from '../../components/chess/MoveHistory';
import { CapturedPieces } from '../../components/chess/CapturedPieces';
import { useBoardState } from '../../hooks/useBoardState';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useMoveHistory } from '../../hooks/useMoveHistory';
import { useArrows } from '../../hooks/useArrows';
import { soundManager } from '../../utils/sounds';
import { Piece } from '../../types/chess';
import { RotateCcw, SkipBack, RefreshCw } from 'lucide-react';

export default function AnalysisPage() {
  const { board, turn, selectedSquare, setSelectedSquare, makeMove, resetBoard, setBoard, setTurn } = useBoardState();
  const { calculateValidMoves, checkGameStatus } = useGameLogic(board, turn);
  const { moveHistory, addMove, canUndo, canRedo, undo, redo, reset: resetMoveHistory } = useMoveHistory();
  const { arrows, startDrawing, finishDrawing, clearArrows } = useArrows();
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[], black: Piece[] }>({ white: [], black: [] });
  const [boardHistory, setBoardHistory] = useState<any[]>([]);
  const [capturedHistory, setCapturedHistory] = useState<any[]>([]);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');

  const handleSquareClick = (position: string) => {
    // Clear arrows on left click
    if (arrows.length > 0) {
      clearArrows();
    }

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

  const handlePieceDrop = (piece: Piece, position: string, sourcePosition?: string) => {
    // Only handle drops from board pieces (not from palette)
    if (!sourcePosition) return;

    // Check if this is a valid move
    const moves = calculateValidMoves(sourcePosition);
    if (moves.includes(position)) {
      handleMove(sourcePosition, position);
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
    clearArrows();
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
      <div className="container mx-auto px-4 py-2">
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
                  orientation={orientation}
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

          {/* Right sidebar with move history and controls */}
          <div className="flex flex-col h-[520px] w-[300px]">
            {/* Turn indicator */}
            <div className="backdrop-blur px-4 py-2.5 rounded-lg shadow-lg bg-gray-800/90 mb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-300">
                  Turn: <span className="capitalize text-white">{turn}</span>
                </span>
                <button
                  onClick={handleFlipBoard}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-colors text-xs font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Flip
                </button>
              </div>
            </div>

            {/* Black captured pieces */}
            <div className="mb-1.5">
              <CapturedPieces pieces={capturedPieces.black} color="black" board={board} />
            </div>

            {/* Move history - fills remaining space */}
            <div className="flex-1 my-3 overflow-hidden">
              <MoveHistory moves={moveHistory} className="h-full" />
            </div>

            {/* Analysis control buttons */}
            <div className="mb-3 flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={handleUndo}
                  disabled={!canUndo()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                  Undo
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 transition-colors text-sm font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* White captured pieces */}
            <div className="mb-1.5">
              <CapturedPieces pieces={capturedPieces.white} color="white" board={board} />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
