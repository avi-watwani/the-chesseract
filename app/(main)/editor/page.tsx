"use client";

import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import PageContainer from '../../components/PageContainer';

export default function EditorPage() {
  const [position, setPosition] = useState<Record<string, string>>({}); // Custom board position
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  // Handle square click for adding/removing pieces
  const onSquareClick = (square: string) => {
    if (selectedSquare && selectedPiece) {
      // Move the selected piece to the clicked square
      setPosition((prev) => {
        const newPosition = { ...prev };
        delete newPosition[selectedSquare]; // Remove the piece from the original square
        newPosition[square] = selectedPiece; // Place the piece on the new square
        return newPosition;
      });
      setSelectedSquare(null);
      setSelectedPiece(null);
    } else if (position[square]) {
      // Select a piece from the board
      setSelectedSquare(square);
      setSelectedPiece(position[square]);
    } else if (selectedPiece) {
      // Place a new piece on the clicked square
      setPosition((prev) => ({
        ...prev,
        [square]: selectedPiece,
      }));
      setSelectedPiece(null);
    }
  };

  // Handle piece drag-and-drop
  const onPieceDrop = (sourceSquare: string, targetSquare: string) => {
    setPosition((prev) => {
      const newPosition = { ...prev };
      newPosition[targetSquare] = newPosition[sourceSquare]; // Move the piece
      delete newPosition[sourceSquare]; // Remove the piece from the source square
      return newPosition;
    });
    return true;
  };

  // Reset the board to an empty state
  const resetBoard = () => {
    setPosition({});
  };

  // Predefined pieces for adding to the board
  const whitePieces = ['wK', 'wQ', 'wB', 'wN', 'wR', 'wP'];
  const blackPieces = ['bK', 'bQ', 'bB', 'bN', 'bR', 'bP'];

  return (
    <PageContainer className="bg-gradient-to-b from-gray-900 to-black text-white mt-10 min-h-screen flex flex-col items-center">
      <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-4 mb-4">
          {whitePieces.map((piece) => (
            <button
              key={piece}
              onClick={() => setSelectedPiece(piece)}
              className={`w-12 h-12 flex items-center justify-center border rounded ${
              selectedPiece === piece ? 'bg-blue-500' : 'bg-gray-800'
              }`}
            >
            <img
              src={`/images/pieces/${piece}.png`}
              alt={piece}
              className="w-8 h-8"
            />
            </button>
          ))}
        </div>
        <div className="flex justify-center mb-4">
          <Chessboard
            position={position} // Custom board position
            onPieceDrop={onPieceDrop} // Drag-to-move functionality
            onSquareClick={onSquareClick} // Click-to-move functionality
            boardWidth={500} // Adjust the size of the board
            boardOrientation="white" // Ensure white pieces are at the bottom
          />
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {blackPieces.map((piece) => (
            <button
              key={piece}
              onClick={() => setSelectedPiece(piece)}
              className={`w-12 h-12 flex items-center justify-center border rounded ${
              selectedPiece === piece ? 'bg-blue-500' : 'bg-gray-800'
              }`}
            >
            <img
              src={`/images/pieces/${piece}.png`}
              alt={piece}
              className="w-8 h-8"
            />
            </button>
          ))}
        </div>
        <button
          onClick={resetBoard}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-bold"
        >
          Reset Board
        </button>
      </div>
    </PageContainer>
  );
}
