import { useState, useCallback } from 'react';
import { Piece, Square } from '../types/chess';
import { isCheckmate, isKingInCheck } from '../utils/chessLogic';

export const useMoveHistory = () => {
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

  const addMove = useCallback((
    from: string,
    to: string,
    movingPiece: Piece,
    capturedPiece: Piece | null,
    board: Square[][],
    nextTurn: 'white' | 'black'
  ) => {
    const [fromFile, fromRank] = from.split('');
    const [toFile, toRank] = to.split('');
    const fromCol = fromFile.charCodeAt(0) - 97;
    const toCol = toFile.charCodeAt(0) - 97;

    // Check if this is a castling move
    const isCastling = movingPiece.type === 'king' && Math.abs(toCol - fromCol) === 2;

    let moveText: string;
    if (isCastling) {
      const isKingside = toCol > fromCol;
      moveText = isKingside ? 'O-O' : 'O-O-O';
    } else {
      const toSquare = `${toFile}${toRank}`;
      const pieceSymbol = movingPiece.type === 'knight' ? 'N' : 
                         movingPiece.type === 'pawn' ? '' : 
                         movingPiece.type[0].toUpperCase();
      
      const captureSymbol = capturedPiece ? 'x' : '';
      const pawnFilePrefix = (movingPiece.type === 'pawn' && capturedPiece) ? fromFile : '';
      
      moveText = `${pieceSymbol}${pawnFilePrefix}${captureSymbol}${toSquare}`;
    }
    
    // Add check or checkmate notation
    if (isCheckmate(board, nextTurn)) {
      moveText += '#';
    } else if (isKingInCheck(board, nextTurn)) {
      moveText += '+';
    }
    
    setMoveHistory(prev => [...prev, moveText]);
    setCurrentMoveIndex(prev => prev + 1);
  }, []);

  const canUndo = useCallback(() => {
    return currentMoveIndex >= 0;
  }, [currentMoveIndex]);

  const canRedo = useCallback(() => {
    return currentMoveIndex < moveHistory.length - 1;
  }, [currentMoveIndex, moveHistory.length]);

  const undo = useCallback(() => {
    if (canUndo()) {
      setCurrentMoveIndex(prev => prev - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo()) {
      setCurrentMoveIndex(prev => prev + 1);
    }
  }, [canRedo]);

  const reset = useCallback(() => {
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
  }, []);

  return {
    moveHistory,
    currentMoveIndex,
    addMove,
    canUndo,
    canRedo,
    undo,
    redo,
    reset
  };
};

