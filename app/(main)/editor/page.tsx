'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageContainer from '../../components/PageContainer';
import { ChessBoardCore } from '../../components/chess/ChessBoardCore';
import { PiecePalette } from '../../components/chess/PiecePalette';
import { useBoardState } from '../../hooks/useBoardState';
import { Piece } from '../../types/chess';
import { Trash2, FileText, Play } from 'lucide-react';

export default function EditorPage() {
  const { board, clearBoard, setPieceAt, resetBoard } = useBoardState();
  const [fenInput, setFenInput] = useState('');
  const router = useRouter();

  const handlePieceDrop = (piece: Piece, position: string) => {
    setPieceAt(position, piece);
  };

  const handleSquareClick = (position: string) => {
    // Right-click or secondary action to remove piece
    // For now, we'll use a simple click to remove
    const [file, rank] = position.split('');
    const col = file.charCodeAt(0) - 97;
    const row = 8 - parseInt(rank);
    
    if (board[row][col].piece) {
      setPieceAt(position, null);
    }
  };

  const handleClearBoard = () => {
    clearBoard();
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
      <div className="container mx-auto px-4 py-8">
        {/* Centered chess board */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="glassmorphism p-6 rounded-xl">
            <ChessBoardCore
              board={board}
              selectedSquare={null}
              validMoves={[]}
              onSquareClick={handleSquareClick}
              orientation="white"
              isInteractive={true}
              onPieceDrop={handlePieceDrop}
              isDraggable={true}
            />
          </div>
          <p className="text-sm text-gray-400 mt-3">Click a piece to remove it from the board</p>

          {/* Controls below board */}
          <div className="mt-8 flex gap-4 max-w-5xl w-full">
            <PiecePalette className="flex-1" />
            
            {/* Editor Controls */}
            <div className="bg-gray-900 rounded-lg p-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Board Actions</h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleClearBoard}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Board
                </button>
                <button
                  onClick={resetBoard}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-500 rounded-md hover:bg-blue-500/30 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Reset to Starting Position
                </button>
                <button
                  onClick={handleAnalyzePosition}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 text-green-500 rounded-md hover:bg-green-500/30 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Analyze Position
                </button>
              </div>
            </div>

            {/* FEN Input */}
            <div className="bg-gray-900 rounded-lg p-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Load from FEN</h3>
              <input
                type="text"
                value={fenInput}
                onChange={(e) => setFenInput(e.target.value)}
                placeholder="Paste FEN notation here"
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:border-blue-500 focus:outline-none mb-3 text-sm"
              />
              <button
                onClick={handleLoadFEN}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-500 rounded-md hover:bg-purple-500/30 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Load FEN
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
