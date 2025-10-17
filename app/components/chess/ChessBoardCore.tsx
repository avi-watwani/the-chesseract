'use client';

import React from 'react';
import { Square } from './Square';
import { Square as SquareType, Piece } from '../../types/chess';

interface ChessBoardCoreProps {
  board: SquareType[][];
  selectedSquare: string | null;
  validMoves: string[];
  onSquareClick: (position: string) => void;
  orientation?: 'white' | 'black';
  isInteractive?: boolean;
  onPieceDrop?: (piece: Piece, position: string) => void;
  isDraggable?: boolean;
}

export const ChessBoardCore: React.FC<ChessBoardCoreProps> = ({
  board,
  selectedSquare,
  validMoves,
  onSquareClick,
  orientation = 'white',
  isInteractive = true,
  onPieceDrop,
  isDraggable = false
}) => {
  const boardToRender = orientation === 'black' 
    ? board.slice().reverse().map(row => row.slice().reverse()) 
    : board;

  return (
    <div className="grid grid-cols-8 gap-0 border-2 border-gray-700">
      {boardToRender.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((square, colIndex) => {
            const isLightSquare = (rowIndex + colIndex) % 2 === 0;
            const isSelected = selectedSquare === square.position;
            const isValidMove = validMoves.includes(square.position);
            
            return (
              <Square
                key={square.position}
                position={square.position}
                piece={square.piece}
                isLight={isLightSquare}
                isSelected={isSelected}
                isValidMove={isValidMove}
                onClick={() => isInteractive && onSquareClick(square.position)}
                onDrop={onPieceDrop}
                isDraggable={isDraggable}
              />
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

