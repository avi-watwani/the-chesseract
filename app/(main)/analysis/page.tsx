"use client";

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js'; // Chess.js for game logic
import { Chessboard } from 'react-chessboard';
import PageContainer from '../../components/PageContainer';

export default function AnalysisPage() {
  const [game, setGame] = useState(new Chess());
  const [boardWidth, setBoardWidth] = useState(650); // State for responsive board width
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null); // Track the last move
  const [history, setHistory] = useState<string[]>([]); // Track game history
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0); // Track current move index

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
      setLastMove({ from: sourceSquare, to: targetSquare }); // Update the last move
      setHistory((prev) => [...prev.slice(0, currentMoveIndex), gameCopy.pgn()]); // Update history
      setCurrentMoveIndex((prev) => prev + 1); // Update current move index
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

  // Navigate backward in history
  const goBackward = () => {
    if (currentMoveIndex > 0) {
      const gameCopy = new Chess();
      gameCopy.loadPgn(history[currentMoveIndex - 1]);
      setGame(gameCopy);
      setCurrentMoveIndex((prev) => prev - 1);
      setLastMove(null); // Clear last move highlight
    }
  };

  // Navigate forward in history
  const goForward = () => {
    if (currentMoveIndex < history.length - 1) {
      const gameCopy = new Chess();
      gameCopy.loadPgn(history[currentMoveIndex + 1]);
      setGame(gameCopy);
      setCurrentMoveIndex((prev) => prev + 1);
      setLastMove(null); // Clear last move highlight
    }
  };

  // Disable dragging of pieces based on the turn
  const isDraggable = (piece: string) => {
    const turn = game.turn(); // 'w' for white, 'b' for black
    return (turn === 'w' && piece.startsWith('w')) || (turn === 'b' && piece.startsWith('b'));
  };

  return (
    <PageContainer className="bg-gradient-to-b from-gray-900 to-black text-white flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center" style={{ width: boardWidth }}>
          <Chessboard
            position={game.fen()} // Set the board position to the current game state
            onPieceDrop={onDrop} // Drag-to-move functionality
            onSquareClick={onSquareClick} // Click-to-move functionality
            boardWidth={boardWidth} // Responsive board width
            boardOrientation="white" // Ensure white pieces are at the bottom
            customSquareStyles={
              lastMove
                ? {
                    [lastMove.from]: { backgroundColor: 'rgba(73, 73, 40, 0.6)' }, // Highlight from square
                    [lastMove.to]: { backgroundColor: 'rgba(68, 68, 26, 0.6)' }, // Highlight to square
                  }
                : {}
            }
            isDraggablePiece={({ piece }) => isDraggable(piece)} // Disable dragging based on turn
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={goBackward}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded text-white"
              disabled={currentMoveIndex === 0} // Disable if at the start
            >
              Backward
            </button>
            <button
              onClick={goForward}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded text-white"
              disabled={currentMoveIndex === history.length - 1} // Disable if at the end
            >
              Forward
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
