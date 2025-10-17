import React from 'react';
import { Piece } from './Piece';
import { Piece as PieceType, Square } from '../../types/chess';

interface CapturedPiecesProps {
  pieces: PieceType[];
  color: 'white' | 'black';
  board: Square[][];
}

const getPiecePoints = (piece: PieceType): number => {
  switch (piece.type) {
    case 'pawn': return 1;
    case 'knight': return 3;
    case 'bishop': return 3;
    case 'rook': return 5;
    case 'queen': return 9;
    case 'king': return 0;
    default: return 0;
  }
};

const calculateNetAdvantage = (board: Square[][], color: 'white' | 'black'): number => {
  let whiteMaterial = 0;
  let blackMaterial = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col].piece;
      if (piece) {
        const points = getPiecePoints(piece);
        if (piece.color === 'white') {
          whiteMaterial += points;
        } else {
          blackMaterial += points;
        }
      }
    }
  }
  
  if (color === 'white') {
    return whiteMaterial - blackMaterial;
  } else {
    return blackMaterial - whiteMaterial;
  }
};

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({ pieces, color, board }) => {
  const netAdvantage = calculateNetAdvantage(board, color);
  
  return (
    <div className={`flex items-center gap-2 ${color === 'white' ? 'justify-end' : 'justify-start'}`}>
      <div className="flex gap-1">
        {pieces.map((piece, index) => (
          <div key={index} className="w-6 h-6 flex items-center justify-center">
            <Piece piece={piece} />
          </div>
        ))}
      </div>
      {netAdvantage > 0 && (
        <span className="text-sm font-semibold text-green-600">
          +{netAdvantage}
        </span>
      )}
    </div>
  );
};

