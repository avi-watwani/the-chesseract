"use client";

import React, { useState, useEffect } from 'react';
import { ChessPieces } from './ChessPieces';
import { Socket } from 'socket.io-client';
import { isValidMove, isKingInCheck, isCheckmate, isStalemate } from '../utils/chessLogic';
import { soundManager } from '../utils/sounds';
import ChessControls from './ChessControls';
import { Piece, Square } from '../types/chess';
import { AlertCircle } from 'lucide-react';

interface ChessBoardProps {
  socket?: Socket;
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
  const [gameStatus, setGameStatus] = useState<'playing' | 'check' | 'checkmate' | 'stalemate' | 'resigned' | 'draw'>('playing');
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[], black: Piece[] }>({
    white: [],
    black: []
  });
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

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

  useEffect(() => {
    // Check game status after each move
    const currentColor = isPlayerTurn ? playerColor : (playerColor === 'white' ? 'black' : 'white');
    
    if (isCheckmate(board, currentColor)) {
      setGameStatus('checkmate');
    } else if (isKingInCheck(board, currentColor)) {
      setGameStatus('check');
    } else if (isStalemate(board, currentColor)) {
      setGameStatus('stalemate');
    } else {
      setGameStatus('playing');
    }
  }, [board, isPlayerTurn]);

  useEffect(() => {
    if (soundManager) {
      soundManager.setEnabled(isSoundEnabled);
    }
  }, [isSoundEnabled]);

  const calculateValidMoves = (position: string) => {
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
  };

  const handleSquareClick = (position: string) => {
    if (!isPlayable || gameStatus === 'checkmate' || gameStatus === 'stalemate') return;
    
    if (selectedSquare === position) {
      setSelectedSquare(null);
      setValidMoves([]);
    } else if (selectedSquare) {
      if (validMoves.includes(position)) {
        handleMove(selectedSquare, position);
      }
      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      const [file, rank] = position.split('');
      const col = file.charCodeAt(0) - 97;
      const row = 8 - parseInt(rank);
      
      if (board[row][col].piece?.color === playerColor && isPlayerTurn) {
        setSelectedSquare(position);
        setValidMoves(calculateValidMoves(position));
      }
    }
  };

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
    setValidMoves([]);

    if (!isOpponentMove) {
      setIsPlayerTurn(false);
      socket?.emit('makeMove', {
        gameId,
        from,
        to
      });
    }

    // Check game status
    const nextColor = isPlayerTurn ? 'black' : 'white';
    if (isCheckmate(newBoard, nextColor)) {
      setGameStatus('checkmate');
      soundManager?.playGameEnd();
    } else if (isStalemate(newBoard, nextColor)) {
      setGameStatus('stalemate');
      soundManager?.playGameEnd();
    } else if (isKingInCheck(newBoard, nextColor)) {
      soundManager?.playCheck();
    }

    // Update move history
    const fromSquare = `${fromFile}${fromRank}`;
    const toSquare = `${toFile}${toRank}`;
    const pieceSymbol = movingPiece.type === 'knight' ? 'N' : movingPiece.type[0].toUpperCase();
    const moveText = `${pieceSymbol}${fromSquare.includes('x') ? 'x' : ''}${toSquare}`;
    setMoveHistory(prev => [...prev, moveText]);

    // Update captured pieces
    if (isOpponentMove) {
      const capturedPiece = newBoard[toRow][toCol].piece;
      if (capturedPiece) {
        handleCapture(capturedPiece);
      }
    }
  };

  const handleCapture = (capturedPiece: Piece) => {
    setCapturedPieces(prev => ({
      ...prev,
      [capturedPiece.color]: [...prev[capturedPiece.color], capturedPiece]
    }));
    soundManager?.playCapture();
  };

  const renderPiece = (piece: Piece | null) => {
    if (!piece) return null;
    
    const key = `${piece.color}-${piece.type}` as const;
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
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Game status overlay */}
        {gameStatus !== 'playing' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="text-2xl font-bold text-white">
              {gameStatus === 'checkmate' && `${turn === 'white' ? 'Black' : 'White'} wins by checkmate!`}
              {gameStatus === 'stalemate' && 'Game drawn by stalemate!'}
              {gameStatus === 'check' && 'Check!'}
            </div>
          </div>
        )}

        {/* Chess board */}
        <div className="grid grid-cols-8 gap-0 border-2 border-gray-700">
          {boardToRender.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((square, colIndex) => {
                const isLightSquare = (rowIndex + colIndex) % 2 === 0;
                const isSelected = selectedSquare === square.position;
                const isValidMove = validMoves.includes(square.position);
                const canMove = selectedSquare && isPlayable && isPlayerTurn;
                
                return (
                  <div
                    key={square.position}
                    className={`
                      w-16 h-16 flex items-center justify-center relative
                      ${isLightSquare ? 'bg-gray-200' : 'bg-gray-600'}
                      ${isSelected ? 'ring-2 ring-yellow-400' : ''}
                      ${isValidMove ? 'cursor-pointer' : ''}
                      hover:opacity-90 transition-opacity
                    `}
                    onClick={() => handleSquareClick(square.position)}
                  >
                    {square.piece && (
                      <div className="w-12 h-12">
                        {renderPiece(square.piece)}
                      </div>
                    )}
                    {isValidMove && !square.piece && (
                      <div className="absolute w-3 h-3 bg-yellow-400 rounded-full opacity-50" />
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Controls */}
      <ChessControls
        moveHistory={moveHistory}
        capturedPieces={capturedPieces}
        onResign={() => {
          setGameStatus('resigned');
          soundManager?.playGameEnd();
          if (socket && gameId) {
            socket.emit('resign', { gameId });
          }
        }}
        onDrawOffer={() => {
          if (socket && gameId) {
            socket.emit('drawOffer', { gameId });
          }
        }}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
      />
    </div>
  );
};

export default ChessBoard; 