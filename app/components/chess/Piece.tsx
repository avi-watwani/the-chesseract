import React, { useRef, useState } from 'react';
import { ChessPieces } from '../ChessPieces';
import { Piece as PieceType } from '../../types/chess';

interface PieceProps {
  piece: PieceType;
  isDraggable?: boolean;
  position?: string; // Source position if piece is on the board
}

export const Piece: React.FC<PieceProps> = ({ piece, isDraggable = false, position }) => {
  const key = `${piece.color}-${piece.type}` as const;
  const pieceRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (isDraggable && pieceRef.current) {
      e.dataTransfer.setData('piece', JSON.stringify(piece));
      if (position) {
        // If piece is from the board, store the source position
        e.dataTransfer.setData('sourcePosition', position);
      }
      e.dataTransfer.effectAllowed = 'move';
      
      // Create a custom drag image container
      const dragImage = document.createElement('div');
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      dragImage.style.left = '-1000px';
      dragImage.style.width = '45px';
      dragImage.style.height = '45px';
      dragImage.style.display = 'flex';
      dragImage.style.alignItems = 'center';
      dragImage.style.justifyContent = 'center';
      
      // Clone the SVG piece
      const svg = pieceRef.current.querySelector('svg');
      if (svg) {
        dragImage.appendChild(svg.cloneNode(true));
      }
      
      document.body.appendChild(dragImage);
      
      // Set the custom drag image centered on cursor (half of 45px = 22.5)
      e.dataTransfer.setDragImage(dragImage, 22.5, 22.5);
      
      // Clean up the temporary element after drag starts
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
      
      // Hide the piece from source square (it's now "in hand")
      setIsDragging(true);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Show the piece again when drag ends (whether dropped successfully or not)
    setIsDragging(false);
  };

  return (
    <div
      ref={pieceRef}
      className="w-full h-full flex items-center justify-center cursor-move"
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ opacity: isDragging ? 0 : 1 }}
    >
      {ChessPieces[key]}
    </div>
  );
};

