import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Piece } from '../../types/chess';

interface PieceBinProps {
  onPieceDrop: (piece: Piece, sourcePosition?: string) => void;
}

export const PieceBin: React.FC<PieceBinProps> = ({ onPieceDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const pieceData = e.dataTransfer.getData('piece');
    const sourcePosition = e.dataTransfer.getData('sourcePosition');
    
    if (pieceData) {
      const droppedPiece: Piece = JSON.parse(pieceData);
      onPieceDrop(droppedPiece, sourcePosition || undefined);
    }
  };

  return (
    <div
      className={`
        bg-gray-900 rounded-lg p-4 
        border-2 border-dashed transition-all
        ${isDragOver ? 'border-red-500 bg-red-500/10' : 'border-gray-700'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-2 py-2">
        <Trash2 
          className={`w-8 h-8 transition-colors ${isDragOver ? 'text-red-400' : 'text-gray-500'}`} 
        />
        <p className={`text-xs font-medium transition-colors ${isDragOver ? 'text-red-400' : 'text-gray-400'}`}>
          {isDragOver ? 'Drop to Delete' : 'Drag here to delete'}
        </p>
      </div>
    </div>
  );
};

