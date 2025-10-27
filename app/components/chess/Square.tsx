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
  onDrop?: (piece: PieceType, position: string, sourcePosition?: string) => void;
  isDraggable?: boolean;
  onRightMouseDown?: (position: string) => void;
  onRightMouseUp?: (position: string) => void;
}

export const Square: React.FC<SquareProps> = ({
  position,
  piece,
  isLight,
  isSelected,
  isValidMove,
  onClick,
  onDrop,
  isDraggable = false,
  onRightMouseDown,
  onRightMouseUp
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
      const sourcePosition = e.dataTransfer.getData('sourcePosition');
      if (pieceData) {
        const droppedPiece: PieceType = JSON.parse(pieceData);
        onDrop(droppedPiece, position, sourcePosition || undefined);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Right click (button 2)
    if (e.button === 2 && onRightMouseDown) {
      e.preventDefault();
      onRightMouseDown(position);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    // Right click (button 2)
    if (e.button === 2 && onRightMouseUp) {
      e.preventDefault();
      onRightMouseUp(position);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    // Prevent context menu from appearing on right-click
    e.preventDefault();
  };

  return (
    <div
      className={`
        w-[65px] h-[65px] flex items-center justify-center relative
        ${isLight ? 'bg-gray-200' : 'bg-gray-600'}
        ${isSelected ? 'ring-2 ring-yellow-400' : ''}
        ${isValidMove ? 'cursor-pointer' : ''}
        hover:opacity-90 transition-opacity
      `}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {piece && (
        <div className="w-12 h-12">
          <Piece piece={piece} isDraggable={isDraggable} position={position} />
        </div>
      )}
      {isValidMove && !piece && (
        <div className="absolute w-3 h-3 bg-yellow-400 rounded-full opacity-50" />
      )}
    </div>
  );
};

