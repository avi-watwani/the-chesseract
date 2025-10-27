import React from 'react';
import { ChessPieces } from '../ChessPieces';
import { Piece as PieceType } from '../../types/chess';

interface PieceProps {
  piece: PieceType;
  isDraggable?: boolean;
  position?: string; // Source position if piece is on the board
}

export const Piece: React.FC<PieceProps> = ({ piece, isDraggable = false, position }) => {
  const key = `${piece.color}-${piece.type}` as const;

  const handleDragStart = (e: React.DragEvent) => {
    if (isDraggable) {
      e.dataTransfer.setData('piece', JSON.stringify(piece));
      if (position) {
        // If piece is from the board, store the source position
        e.dataTransfer.setData('sourcePosition', position);
      }
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      draggable={isDraggable}
      onDragStart={handleDragStart}
    >
      {ChessPieces[key]}
    </div>
  );
};

