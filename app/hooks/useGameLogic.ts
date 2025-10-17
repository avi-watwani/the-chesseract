import { useState, useCallback, useEffect } from 'react';
import { Square, Piece } from '../types/chess';
import { isValidMove, isKingInCheck, isCheckmate, isStalemate } from '../utils/chessLogic';

export const useGameLogic = (board: Square[][], turn: 'white' | 'black') => {
  const [gameStatus, setGameStatus] = useState<'playing' | 'check' | 'checkmate' | 'stalemate' | 'resigned' | 'draw'>('playing');

  const calculateValidMoves = useCallback((position: string): string[] => {
    const [file, rank] = position.split('');
    const row = 8 - parseInt(rank);
    const col = file.charCodeAt(0) - 97;
    const piece = board[row][col].piece;
    
    if (!piece) return [];
    
    const moves: string[] = [];
    for (let toRow = 0; toRow < 8; toRow++) {
      for (let toCol = 0; toCol < 8; toCol++) {
        if (isValidMove(board, { row, col }, { row: toRow, col: toCol }, piece)) {
          const toFile = String.fromCharCode(97 + toCol);
          const toRank = 8 - toRow;
          moves.push(`${toFile}${toRank}`);
        }
      }
    }
    return moves;
  }, [board]);

  const checkGameStatus = useCallback(() => {
    if (isCheckmate(board, turn)) {
      setGameStatus('checkmate');
      return 'checkmate';
    } else if (isKingInCheck(board, turn)) {
      setGameStatus('check');
      return 'check';
    } else if (isStalemate(board, turn)) {
      setGameStatus('stalemate');
      return 'stalemate';
    } else {
      setGameStatus('playing');
      return 'playing';
    }
  }, [board, turn]);

  const isMoveLegal = useCallback((from: string, to: string): boolean => {
    const [fromFile, fromRank] = from.split('');
    const fromCol = fromFile.charCodeAt(0) - 97;
    const fromRow = 8 - parseInt(fromRank);
    const piece = board[fromRow][fromCol].piece;
    
    if (!piece) return false;

    const [toFile, toRank] = to.split('');
    const toCol = toFile.charCodeAt(0) - 97;
    const toRow = 8 - parseInt(toRank);
    
    return isValidMove(board, { row: fromRow, col: fromCol }, { row: toRow, col: toCol }, piece);
  }, [board]);

  return {
    gameStatus,
    setGameStatus,
    calculateValidMoves,
    checkGameStatus,
    isMoveLegal
  };
};

