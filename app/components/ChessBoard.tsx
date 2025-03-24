"use client";

import React, { useState } from 'react';
import { ChessPieces } from './ChessPieces';

type Piece = {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  color: 'white' | 'black';
};

type PieceKey = `${Piece['color']}-${Piece['type']}`;

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
      setSelectedSquare(null);
    } else if (selectedSquare) {
      const [prevFile, prevRank] = selectedSquare.split('');
      const prevCol = prevFile.charCodeAt(0) - 97;
      const prevRow = 8 - parseInt(prevRank);
      
      const newBoard = [...board];
      newBoard[row][col].piece = newBoard[prevRow][prevCol].piece;
      newBoard[prevRow][prevCol].piece = null;
      
      setBoard(newBoard);
      setSelectedSquare(null);
    } else if (board[row][col].piece) {
      setSelectedSquare(position);
    }
  };
  
  const renderPiece = (piece: Piece | null) => {
    if (!piece) return null;
    
    const key = `${piece.color}-${piece.type}` as PieceKey;
    return (
      <div className="w-full h-full flex items-center justify-center">
        {ChessPieces[key]}
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="aspect-square relative shadow-2xl rounded-lg overflow-hidden border-4 border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50"></div>
        <div className="relative grid grid-cols-8">
          {board.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((square, colIndex) => {
                const isLightSquare = (rowIndex + colIndex) % 2 === 0;
                const isSelected = selectedSquare === square.position;
                
                return (
                  <div
                    key={square.position}
                    className={`
                      aspect-square flex items-center justify-center
                      ${isLightSquare ? 'bg-[#E8D0AA]' : 'bg-[#B58863]'}
                      ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-50 ring-inset' : ''}
                      ${square.piece ? 'hover:bg-yellow-400/20' : ''}
                      transition-colors duration-200 cursor-pointer
                      relative
                    `}
                    onClick={() => handleSquareClick(square.position)}
                  >
                    <div className={`
                      absolute inset-0 opacity-0 group-hover:opacity-100
                      transition-opacity duration-200
                      ${isSelected ? 'bg-blue-400/20' : ''}
                    `}></div>
                    {renderPiece(square.piece)}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Board coordinates */}
      <div className="flex justify-between px-4 mt-2 text-gray-400">
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(file => (
          <span key={file} className="text-sm">{file}</span>
        ))}
      </div>
    </div>
  );
};

export default ChessBoard; 