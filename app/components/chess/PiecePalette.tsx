import React from 'react';
import { Piece } from './Piece';
import { Piece as PieceType } from '../../types/chess';

const pieces: PieceType[] = [
  { type: 'king', color: 'white' },
  { type: 'queen', color: 'white' },
  { type: 'rook', color: 'white' },
  { type: 'bishop', color: 'white' },
  { type: 'knight', color: 'white' },
  { type: 'pawn', color: 'white' },
  { type: 'king', color: 'black' },
  { type: 'queen', color: 'black' },
  { type: 'rook', color: 'black' },
  { type: 'bishop', color: 'black' },
  { type: 'knight', color: 'black' },
  { type: 'pawn', color: 'black' },
];

interface PiecePaletteProps {
  className?: string;
}

export const PiecePalette: React.FC<PiecePaletteProps> = ({ className = '' }) => {
  return (
    <div className={`bg-gray-900 rounded-lg p-3 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-200 mb-2">Piece Palette</h3>
      <div className="grid grid-cols-6 gap-1.5">
        {pieces.map((piece, index) => (
          <div
            key={index}
            className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 cursor-move transition-colors"
          >
            <Piece piece={piece} isDraggable={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

