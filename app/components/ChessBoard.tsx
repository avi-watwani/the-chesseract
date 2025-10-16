"use client";

import React, { useState, useEffect } from 'react';
import { ChessPieces } from './ChessPieces';
import { Socket } from 'socket.io-client';
import { isValidMove, isKingInCheck, isCheckmate, isStalemate } from '../utils/chessLogic';
import { soundManager } from '../utils/sounds';
import ChessControls from './ChessControls';
import { Piece, Square } from '../types/chess';
import { AlertCircle, Flag, Scale, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface ChessBoardProps {
  socket?: Socket;
  gameId?: string;
  playerColor?: 'white' | 'black';
  isPlayable?: boolean;
  isAnalysisMode?: boolean;
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
  isPlayable = true,
  isAnalysisMode = false
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
    // Check game status after each move (only in non-analysis mode)
    if (!isAnalysisMode) {
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
    }
  }, [board, isPlayerTurn, isAnalysisMode]);

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
    if (!isPlayable || (!isAnalysisMode && (gameStatus === 'checkmate' || gameStatus === 'stalemate'))) return;
    
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
      
      // In analysis mode, allow selecting any piece
      if (isAnalysisMode && board[row][col].piece) {
        setSelectedSquare(position);
        setValidMoves(calculateValidMoves(position));
      } else if (!isAnalysisMode && board[row][col].piece?.color === playerColor && isPlayerTurn) {
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
    
    // In analysis mode, allow any move without restrictions
    if (!isAnalysisMode) {
      if (!isOpponentMove && movingPiece.color !== playerColor) return;
      if (!isOpponentMove && !isPlayerTurn) return;
    }

    // Check for captured piece BEFORE making the move
    const capturedPiece = newBoard[toRow][toCol].piece;
    if (capturedPiece && (isOpponentMove || isAnalysisMode)) {
      handleCapture(capturedPiece);
    }

    newBoard[toRow][toCol].piece = movingPiece;
    newBoard[fromRow][fromCol].piece = null;
    
    setBoard(newBoard);
    setSelectedSquare(null);
    setValidMoves([]);

    // Only emit socket events and update turn in non-analysis mode
    if (!isAnalysisMode && !isOpponentMove) {
      setIsPlayerTurn(false);
      socket?.emit('makeMove', {
        gameId,
        from,
        to
      });
    }

    // Update turn for analysis mode
    if (isAnalysisMode) {
      setTurn(prevTurn => prevTurn === 'white' ? 'black' : 'white');
    }

    // Check game status (only in non-analysis mode or if we want to show check/checkmate in analysis)
    if (!isAnalysisMode) {
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
    }

    // Update move history
    const fromSquare = `${fromFile}${fromRank}`;
    const toSquare = `${toFile}${toRank}`;
    const pieceSymbol = movingPiece.type === 'knight' ? 'N' : movingPiece.type[0].toUpperCase();
    const moveText = `${pieceSymbol}${fromSquare.includes('x') ? 'x' : ''}${toSquare}`;
    setMoveHistory(prev => [...prev, moveText]);
  };

  const handleCapture = (capturedPiece: Piece) => {
    setCapturedPieces(prev => ({
      ...prev,
      [capturedPiece.color]: [...prev[capturedPiece.color], capturedPiece]
    }));
    soundManager?.playCapture();
  };

  const handleReset = () => {
    setBoard(initialBoard);
    setSelectedSquare(null);
    setValidMoves([]);
    setMoveHistory([]);
    setCapturedPieces({ white: [], black: [] });
    setTurn('white');
    setGameStatus('playing');
    setIsPlayerTurn(playerColor === 'white');
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

  // Helper function to get piece point values
  const getPiecePoints = (piece: Piece): number => {
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

  // Helper function to render captured pieces
  const renderCapturedPieces = (pieces: Piece[], color: 'white' | 'black') => {
    const totalPoints = pieces.reduce((sum, piece) => sum + getPiecePoints(piece), 0);
    
    return (
      <div className={`flex items-center gap-2 ${color === 'white' ? 'justify-end' : 'justify-start'}`}>
        <div className="flex gap-1">
          {pieces.map((piece, index) => (
            <div key={index} className="w-6 h-6 flex items-center justify-center">
              {renderPiece(piece)}
            </div>
          ))}
        </div>
        {totalPoints > 0 && (
          <span className="text-sm font-semibold text-gray-600">+{totalPoints}</span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex justify-center items-start">
      {/* Chess board with captured pieces - centered */}
      <div className="flex flex-col items-center">
        {/* Black captured pieces (above board) */}
        <div className="mb-2 w-full max-w-[512px] px-2">
          {renderCapturedPieces(capturedPieces.black, 'black')}
        </div>

        <div className="relative">
          {/* Game status overlay */}
          {!isAnalysisMode && gameStatus !== 'playing' && (
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

        {/* White captured pieces (below board) */}
        <div className="mt-2 w-full max-w-[512px] px-2">
          {renderCapturedPieces(capturedPieces.white, 'white')}
        </div>
      </div>

      {/* Move history and controls - positioned to the right */}
      <div className="flex flex-col gap-4 min-w-[300px] ml-6">
        {/* Move History */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Move History</h3>
          <div className="h-96 overflow-y-auto">
            <div className="space-y-1">
              {Array.from({ length: Math.ceil(moveHistory.length / 2) }, (_, index) => {
                const whiteMove = moveHistory[index * 2];
                const blackMove = moveHistory[index * 2 + 1];
                const moveNumber = index + 1;
                
                return (
                  <div key={index} className="flex items-center text-gray-300 py-1 hover:bg-gray-800 rounded px-2">
                    <span className="w-8 text-gray-500 font-semibold">{moveNumber}.</span>
                    <div className="flex-1 flex gap-4">
                      <span className="flex-1">{whiteMove || ''}</span>
                      <span className="flex-1">{blackMove || ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 rounded-lg p-4">
          {!isAnalysisMode && (
            <div className="flex justify-between mb-4">
              <button
                onClick={() => {
                  setGameStatus('resigned');
                  soundManager?.playGameEnd();
                  if (socket && gameId) {
                    socket.emit('resign', { gameId });
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30 transition-colors"
              >
                <Flag className="w-4 h-4" />
                Resign
              </button>
              <button
                onClick={() => {
                  if (socket && gameId) {
                    socket.emit('drawOffer', { gameId });
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-500 rounded-md hover:bg-blue-500/30 transition-colors"
              >
                <Scale className="w-4 h-4" />
                Offer Draw
              </button>
            </div>
          )}
          {isAnalysisMode && (
            <div className="flex justify-between mb-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-500 rounded-md hover:bg-green-500/30 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Board
              </button>
            </div>
          )}
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700/20 text-gray-300 rounded-md hover:bg-gray-700/30 transition-colors w-full justify-center"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            {isSoundEnabled ? 'Sound On' : 'Sound Off'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChessBoard; 