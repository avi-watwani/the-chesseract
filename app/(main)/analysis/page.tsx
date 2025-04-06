"use client";

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js'; // Chess.js for game logic
import { Chessboard } from 'react-chessboard';
import PageContainer from '../../components/PageContainer';

export default function AnalysisPage() {
  const [game, setGame] = useState(new Chess());
  const [boardWidth, setBoardWidth] = useState(650); // State for responsive board width

  useEffect(() => {
    const updateBoardWidth = () => {
      setBoardWidth(Math.min(650, window.innerWidth - 40)); // Adjust board width based on screen size
    };

    updateBoardWidth(); // Set initial board width
    window.addEventListener('resize', updateBoardWidth); // Update on window resize

    return () => {
      window.removeEventListener('resize', updateBoardWidth); // Cleanup listener
    };
  }, []);

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
      return true; // Indicate the move was valid
    }
    return false; // Indicate the move was invalid
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
    <PageContainer className="bg-gradient-to-b from-gray-900 to-black text-white flex justify-center mt-8 pt-4">
      <div className="flex justify-center">
        <Chessboard
          position={game.fen()} // Set the board position to the current game state
          onPieceDrop={onDrop} // Drag-to-move functionality
          onSquareClick={onSquareClick} // Click-to-move functionality
          boardWidth={boardWidth} // Responsive board width
          boardOrientation="white" // Ensure white pieces are at the bottom
        />
      </div>
    </PageContainer>
  );
}
