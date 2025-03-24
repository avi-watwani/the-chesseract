"use client";

import React, { useState, useEffect } from 'react';
import { ChessPieces } from './ChessPieces';
import { Socket } from 'socket.io-client';

type Piece = {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  color: 'white' | 'black';
};

type PieceKey = `${Piece['color']}-${Piece['type']}`;

type Square = {
  piece: Piece | null;
  position: string;
};

interface ChessBoardProps {
  socket?: typeof Socket;
  gameId?: string;
  playerColor?: 'white' | 'black';
  isPlayable?: boolean;
}

const initialBoard: Square[][] = Array(8).fill(null).map((_, rowIndex) => {
  return Array(8).fill(null).map((_, colIndex) => {
    const file = String.fromCharCode(97 + colIndex);
    const rank = 8 - rowIndex;
    const position = `${file}${rank}`;
    
    let piece: Piece | null = null;
    
    if (rank === 2) {
      piece = { type: 'pawn', color: 'white' };
    } else if (rank === 7) {
      piece = { type: 'pawn', color: 'black' };
    }
    
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

const ChessBoard: React.FC<ChessBoardProps> = ({ 
  socket, 
  gameId, 
  playerColor = 'white',
  isPlayable = true 
}) => {
  const [board, setBoard] = useState<Square[][]>(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(playerColor === 'white');

  useEffect(() => {
    if (socket && gameId) {
      socket.on('moveMade', ({ from, to }: { from: string; to: string }) => {
        handleMove(from, to, true);
        setIsPlayerTurn(true);
      });

      return () => {
        socket.off('moveMade');
      };
    }
  }, [socket, gameId]);

  const handleMove = (from: string, to: string, isOpponentMove = false) => {
    const [fromFile, fromRank] = from.split('');
    const [toFile, toRank] = to.split('');
    
    const fromCol = fromFile.charCodeAt(0) - 97;
    const fromRow = 8 - parseInt(fromRank);
    const toCol = toFile.charCodeAt(0) - 97;
    const toRow = 8 - parseInt(toRank);

    const newBoard = [...board];
    const movingPiece = newBoard[fromRow][fromCol].piece;

    if (!movingPiece) return;
    if (!isOpponentMove && movingPiece.color !== playerColor) return;
    if (!isOpponentMove && !isPlayerTurn) return;

    newBoard[toRow][toCol].piece = movingPiece;
    newBoard[fromRow][fromCol].piece = null;
    
    setBoard(newBoard);
    setSelectedSquare(null);

    if (!isOpponentMove) {
      setIsPlayerTurn(false);
      socket?.emit('makeMove', {
        gameId,
        from,
        to
      });
    }
  };

  const handleSquareClick = (position: string) => {
    if (!isPlayable) return;
    
    if (selectedSquare === position) {
      setSelectedSquare(null);
    } else if (selectedSquare) {
      handleMove(selectedSquare, position);
    } else {
      const [file, rank] = position.split('');
      const col = file.charCodeAt(0) - 97;
      const row = 8 - parseInt(rank);
      
      if (board[row][col].piece?.color === playerColor && isPlayerTurn) {
        setSelectedSquare(position);
      }
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

  const boardToRender = playerColor === 'black' ? 
    board.slice().reverse().map(row => row.slice().reverse()) : 
    board;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="aspect-square relative shadow-2xl rounded-lg overflow-hidden border-4 border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50"></div>
        <div className="relative grid grid-cols-8">
          {boardToRender.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((square, colIndex) => {
                const isLightSquare = (rowIndex + colIndex) % 2 === 0;
                const isSelected = selectedSquare === square.position;
                const canMove = selectedSquare && isPlayable && isPlayerTurn;
                
                return (
                  <div
                    key={square.position}
                    className={`
                      aspect-square flex items-center justify-center
                      ${isLightSquare ? 'bg-[#E8D0AA]' : 'bg-[#B58863]'}
                      ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-50 ring-inset' : ''}
                      ${canMove ? 'hover:bg-yellow-400/20' : ''}
                      ${isPlayable ? 'cursor-pointer' : 'cursor-default'}
                      transition-colors duration-200
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
      
      <div className="flex justify-between px-4 mt-2 text-gray-400">
        {(playerColor === 'white' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']).map(file => (
          <span key={file} className="text-sm">{file}</span>
        ))}
      </div>
    </div>
  );
};

export default ChessBoard; 