"use client";

import { useState } from 'react';
import { Chess } from 'chess.js'; // Chess.js for game logic
import { Chessboard } from 'react-chessboard';
import PageContainer from '../../components/PageContainer';

export default function AnalysisPage() {
  const [game, setGame] = useState(new Chess());

  // Handle piece drop (drag-to-move)
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const gameCopy = new Chess();
    gameCopy.loadPgn(game.pgn());
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // Always promote to a queen for simplicity
    });

    if (move) {
      setGame(gameCopy); // Update the game state if the move is valid
      return true; // Return true for a valid move
    }
    return false; // Return false for an invalid move
  };

  // Handle click-to-move
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const onSquareClick = (square: string) => {
    if (selectedSquare) {
      const gameCopy = new Chess();
      gameCopy.loadPgn(game.pgn());
      const move = gameCopy.move({
        from: selectedSquare,
        to: square,
        promotion: 'q',
      });

      if (move) {
        setGame(gameCopy); // Update the game state if the move is valid
        setSelectedSquare(null); // Reset the selected square
      } else {
        setSelectedSquare(square); // Select a new square
      }
    } else {
      setSelectedSquare(square); // Select the clicked square
    }
  };

  return (
    <PageContainer className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6">Analysis Board</h1>
        <p className="text-xl text-gray-300 mb-8">
          Analyze your games with our powerful analysis board.
        </p>
        <div className="flex justify-center">
          <Chessboard
            position={game.fen()} // Set the board position to the current game state
            onPieceDrop={onDrop} // Drag-to-move functionality
            onSquareClick={onSquareClick} // Click-to-move functionality
            boardWidth={500} // Adjust the size of the board
          />
        </div>
      </div>
    </PageContainer>
  );
}
