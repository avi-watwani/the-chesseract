import React from 'react';
import { ChessPieces } from '../ChessPieces';
import { Piece as PieceType } from '../../types/chess';

interface PieceProps {
  piece: PieceType;
  isDraggable?: boolean;
}

export const Piece: React.FC<PieceProps> = ({ piece, isDraggable = false }) => {
  const key = `${piece.color}-${piece.type}` as const;

  const handleDragStart = (e: React.DragEvent) => {
    if (isDraggable) {
      e.dataTransfer.setData('piece', JSON.stringify(piece));
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

