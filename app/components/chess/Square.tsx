import React from 'react';
import { Piece } from './Piece';
import { Piece as PieceType } from '../../types/chess';

interface SquareProps {
  position: string;
  piece: PieceType | null;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  onClick: () => void;
  onDrop?: (piece: PieceType, position: string) => void;
  isDraggable?: boolean;
}

export const Square: React.FC<SquareProps> = ({
  position,
  piece,
  isLight,
  isSelected,
  isValidMove,
  onClick,
  onDrop,
  isDraggable = false
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    if (onDrop) {
      e.preventDefault();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (onDrop) {
      const pieceData = e.dataTransfer.getData('piece');
      if (pieceData) {
        const droppedPiece: PieceType = JSON.parse(pieceData);
        onDrop(droppedPiece, position);
      }
    }
  };

  return (
    <div
      className={`
        w-16 h-16 flex items-center justify-center relative
        ${isLight ? 'bg-gray-200' : 'bg-gray-600'}
        ${isSelected ? 'ring-2 ring-yellow-400' : ''}
        ${isValidMove ? 'cursor-pointer' : ''}
        hover:opacity-90 transition-opacity
      `}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {piece && (
        <div className="w-12 h-12">
          <Piece piece={piece} isDraggable={isDraggable} />
        </div>
      )}
      {isValidMove && !piece && (
        <div className="absolute w-3 h-3 bg-yellow-400 rounded-full opacity-50" />
      )}
    </div>
  );
};

