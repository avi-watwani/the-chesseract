"use client";

import React, { useState } from 'react';

type Piece = {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  color: 'white' | 'black';
};

type Square = {
  piece: Piece | null;
  position: string;
};

const initialBoard: Square[][] = Array(8).fill(null).map((_, rowIndex) => {
  return Array(8).fill(null).map((_, colIndex) => {
    const file = String.fromCharCode(97 + colIndex); // a-h
    const rank = 8 - rowIndex; // 1-8
    const position = `${file}${rank}`;
    
    let piece: Piece | null = null;
    
    // Set up pawns
    if (rank === 2) {
      piece = { type: 'pawn', color: 'white' };
    } else if (rank === 7) {
      piece = { type: 'pawn', color: 'black' };
    }
    
    // Set up other pieces
    if (rank === 1 || rank === 8) {
      const color = rank === 1 ? 'white' : 'black';
      
      if (file === 'a' || file === 'h') {
        piece = { type: 'rook', color };
      } else if (file === 'b' || file === 'g') {
        piece = { type: 'knight', color };
      } else if (file === 'c' || file === 'f') {
        piece = { type: 'bishop', color };
      } else if (file === 'd') {
        piece = { type: 'queen', color };
      } else if (file === 'e') {
        piece = { type: 'king', color };
      }
    }
    
    return { piece, position };
  });
});

const ChessBoard: React.FC = () => {
  const [board, setBoard] = useState<Square[][]>(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  
  const handleSquareClick = (position: string) => {
    const [file, rank] = position.split('');
    const col = file.charCodeAt(0) - 97;
    const row = 8 - parseInt(rank);
    
    if (selectedSquare === position) {
      // Deselect if clicking the same square
      setSelectedSquare(null);
    } else if (selectedSquare) {
      // Move piece if a square was already selected
      const [prevFile, prevRank] = selectedSquare.split('');
      const prevCol = prevFile.charCodeAt(0) - 97;
      const prevRow = 8 - parseInt(prevRank);
      
      const newBoard = [...board];
      newBoard[row][col].piece = newBoard[prevRow][prevCol].piece;
      newBoard[prevRow][prevCol].piece = null;
      
      setBoard(newBoard);
      setSelectedSquare(null);
    } else if (board[row][col].piece) {
      // Select square if it has a piece
      setSelectedSquare(position);
    }
  };
  
  const renderPiece = (piece: Piece | null) => {
    if (!piece) return null;
    
    const symbols: Record<string, string> = {
      'white-pawn': '♙',
      'white-rook': '♖',
      'white-knight': '♘',
      'white-bishop': '♗',
      'white-queen': '♕',
      'white-king': '♔',
      'black-pawn': '♟',
      'black-rook': '♜',
      'black-knight': '♞',
      'black-bishop': '♝',
      'black-queen': '♛',
      'black-king': '♚',
    };
    
    const key = `${piece.color}-${piece.type}`;
    return (
      <span className="text-4xl">{symbols[key]}</span>
    );
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="border-2 border-gray-700 rounded">
        <div className="grid grid-cols-8">
          {board.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((square, colIndex) => {
                const isLightSquare = (rowIndex + colIndex) % 2 === 0;
                const isSelected = selectedSquare === square.position;
                
                return (
                  <div
                    key={square.position}
                    className={`
                      flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16
                      ${isLightSquare ? 'bg-chess-100' : 'bg-chess-800'}
                      ${isSelected ? 'ring-2 ring-inset ring-blue-500' : ''}
                      cursor-pointer
                    `}
                    onClick={() => handleSquareClick(square.position)}
                  >
                    {renderPiece(square.piece)}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard; 