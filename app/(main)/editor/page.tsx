'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageContainer from '../../components/PageContainer';
import { ChessBoardCore } from '../../components/chess/ChessBoardCore';
import { PiecePalette } from '../../components/chess/PiecePalette';
import { useBoardState } from '../../hooks/useBoardState';
import { useArrows } from '../../hooks/useArrows';
import { Piece } from '../../types/chess';
import { Trash2, FileText, Play } from 'lucide-react';

export default function EditorPage() {
  const { board, clearBoard, setPieceAt, resetBoard } = useBoardState();
  const { arrows, startDrawing, finishDrawing, clearArrows } = useArrows();
  const [fenInput, setFenInput] = useState('');
  const router = useRouter();

  const handlePieceDrop = (piece: Piece, position: string) => {
    setPieceAt(position, piece);
  };

  const handleSquareClick = (position: string) => {
    // Clear arrows on left click
    if (arrows.length > 0) {
      clearArrows();
    }
  };

  const handleClearBoard = () => {
    clearBoard();
    clearArrows();
  };

  const handleResetBoard = () => {
    resetBoard();
    clearArrows();
  };

  const handleLoadFEN = () => {
    // TODO: Implement FEN loading logic
    console.log('Loading FEN:', fenInput);
    alert('FEN loading will be implemented soon!');
  };

  const handleAnalyzePosition = () => {
    // Navigate to analysis page with the current position
    // For now, we'll just navigate to the analysis page
    // In a full implementation, you'd pass the board state via router state or global state
    router.push('/analysis');
  };

  return (
    <PageContainer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-2">
        {/* Board and sidebar layout */}
        <div className="flex items-center justify-center gap-6 h-[calc(100vh-120px)]">
          {/* Chess board on the left */}
          <div className="flex flex-col items-center">
            <div className="glassmorphism p-3 rounded-xl">
              <div className="w-[520px] h-[520px]">
                <ChessBoardCore
                  board={board}
                  selectedSquare={null}
                  validMoves={[]}
                  onSquareClick={handleSquareClick}
                  orientation="white"
                  isInteractive={true}
                  onPieceDrop={handlePieceDrop}
                  isDraggable={true}
                  arrows={arrows}
                  onSquareRightClick={startDrawing}
                  onSquareRightRelease={finishDrawing}
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Drag pieces from palette or move pieces on board • Right-click and drag to draw arrows</p>
          </div>

          {/* Right sidebar with piece palette and controls */}
          <div className="flex flex-col h-[520px] w-[300px]">
            {/* Piece Palette */}
            <div className="mb-3">
              <PiecePalette />
            </div>

            {/* Board Actions */}
            <div className="bg-gray-900 rounded-lg p-3 mb-3">
              <h3 className="text-sm font-semibold text-gray-200 mb-2">Board Actions</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleClearBoard}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Board
                </button>
                <button
                  onClick={handleResetBoard}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-colors text-sm font-medium"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Reset Position
                </button>
                <button
                  onClick={handleAnalyzePosition}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 transition-colors text-sm font-medium"
                >
                  <Play className="w-3.5 h-3.5" />
                  Analyze Position
                </button>
              </div>
            </div>

            {/* FEN Input */}
            <div className="bg-gray-900 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-gray-200 mb-2">Load from FEN</h3>
              <input
                type="text"
                value={fenInput}
                onChange={(e) => setFenInput(e.target.value)}
                placeholder="Paste FEN notation here"
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-blue-500 focus:outline-none mb-2 text-xs"
              />
              <button
                onClick={handleLoadFEN}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-md hover:bg-purple-500/30 transition-colors text-sm font-medium"
              >
                <FileText className="w-3.5 h-3.5" />
                Load FEN
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
