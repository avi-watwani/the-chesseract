import { useState, useCallback } from 'react';
import { Square, Piece } from '../types/chess';

const createInitialBoard = (): Square[][] => {
  return Array(8).fill(null).map((_, rowIndex) => {
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
};

export const useBoardState = (initialFen?: string) => {
  const [board, setBoard] = useState<Square[][]>(createInitialBoard());
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const makeMove = useCallback((from: string, to: string): Piece | null => {
    const [fromFile, fromRank] = from.split('');
    const [toFile, toRank] = to.split('');
    
    const fromCol = fromFile.charCodeAt(0) - 97;
    const fromRow = 8 - parseInt(fromRank);
    const toCol = toFile.charCodeAt(0) - 97;
    const toRow = 8 - parseInt(toRank);

    let capturedPiece: Piece | null = null;

    // Use functional state update to always get the latest board state
    setBoard(currentBoard => {
      const newBoard = currentBoard.map(row => [...row]);
      const movingPiece = newBoard[fromRow][fromCol].piece;

      if (!movingPiece) return currentBoard;

      // Check for captured piece BEFORE making the move
      capturedPiece = newBoard[toRow][toCol].piece;

      // Check if this is a castling move
      const isCastling = movingPiece.type === 'king' && Math.abs(toCol - fromCol) === 2;
      
      newBoard[toRow][toCol].piece = movingPiece;
      newBoard[fromRow][fromCol].piece = null;
      
      // Move the rook if castling
      if (isCastling) {
        const isKingside = toCol > fromCol;
        const rookFromCol = isKingside ? 7 : 0;
        const rookToCol = isKingside ? 5 : 3;
        
        const rook = newBoard[fromRow][rookFromCol].piece;
        if (rook) {
          newBoard[fromRow][rookToCol].piece = rook;
          newBoard[fromRow][rookFromCol].piece = null;
        }
      }
      
      return newBoard;
    });
    
    setTurn(prevTurn => prevTurn === 'white' ? 'black' : 'white');

    return capturedPiece;
  }, []);

  const resetBoard = useCallback(() => {
    setBoard(createInitialBoard());
    setTurn('white');
    setSelectedSquare(null);
  }, []);

  const clearBoard = useCallback(() => {
    const emptyBoard = Array(8).fill(null).map((_, rowIndex) => {
      return Array(8).fill(null).map((_, colIndex) => {
        const file = String.fromCharCode(97 + colIndex);
        const rank = 8 - rowIndex;
        const position = `${file}${rank}`;
        return { piece: null, position };
      });
    });
    setBoard(emptyBoard);
  }, []);

  const setPieceAt = useCallback((position: string, piece: Piece | null) => {
    const [file, rank] = position.split('');
    const col = file.charCodeAt(0) - 97;
    const row = 8 - parseInt(rank);
    
    const newBoard = [...board];
    newBoard[row][col].piece = piece;
    setBoard(newBoard);
  }, [board]);

  return {
    board,
    turn,
    selectedSquare,
    setSelectedSquare,
    makeMove,
    resetBoard,
    clearBoard,
    setPieceAt,
    setBoard,
    setTurn
  };
};

