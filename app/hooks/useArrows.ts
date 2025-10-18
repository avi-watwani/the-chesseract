import { useState, useCallback } from 'react';

export type Arrow = {
  from: string;
  to: string;
  color: string;
};

// Check if a move follows legal chess geometry
const isLegalChessMove = (from: string, to: string): boolean => {
  const fromFile = from.charCodeAt(0) - 97; // a=0, b=1, ..., h=7
  const fromRank = parseInt(from[1]) - 1;   // 1=0, 2=1, ..., 8=7
  const toFile = to.charCodeAt(0) - 97;
  const toRank = parseInt(to[1]) - 1;
  
  const fileDiff = Math.abs(toFile - fromFile);
  const rankDiff = Math.abs(toRank - fromRank);
  
  // Same square (for highlighting)
  if (fileDiff === 0 && rankDiff === 0) return true;
  
  // Rook move (straight line: horizontal or vertical)
  if (fileDiff === 0 || rankDiff === 0) return true;
  
  // Bishop move (diagonal: equal file and rank difference)
  if (fileDiff === rankDiff) return true;
  
  // Knight move (L-shape: 2+1 or 1+2)
  if ((fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2)) return true;
  
  // King/Pawn move (one square in any direction - already covered by above, but adding for clarity)
  // This is actually covered by the rook, bishop, and same square checks above
  
  return false;
};

export const useArrows = () => {
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [drawingArrow, setDrawingArrow] = useState<string | null>(null);

  const startDrawing = useCallback((position: string) => {
    setDrawingArrow(position);
  }, []);

  const finishDrawing = useCallback((position: string) => {
    if (drawingArrow && drawingArrow !== position) {
      // Check if the move is geometrically legal in chess
      if (!isLegalChessMove(drawingArrow, position)) {
        setDrawingArrow(null);
        return; // Don't draw illegal moves
      }
      
      // Add a new arrow from drawingArrow to position
      setArrows(prev => {
        // Check if arrow already exists
        const existingIndex = prev.findIndex(
          arrow => arrow.from === drawingArrow && arrow.to === position
        );
        
        if (existingIndex !== -1) {
          // Remove existing arrow
          return prev.filter((_, index) => index !== existingIndex);
        } else {
          // Add new arrow with green color (default)
          return [...prev, { from: drawingArrow, to: position, color: '#15803d' }];
        }
      });
    } else if (drawingArrow === position) {
      // If clicking the same square, highlight it with a circle (represented as an arrow to itself)
      setArrows(prev => {
        const existingIndex = prev.findIndex(
          arrow => arrow.from === position && arrow.to === position
        );
        
        if (existingIndex !== -1) {
          return prev.filter((_, index) => index !== existingIndex);
        } else {
          return [...prev, { from: position, to: position, color: '#dc2626' }];
        }
      });
    }
    
    setDrawingArrow(null);
  }, [drawingArrow]);

  const cancelDrawing = useCallback(() => {
    setDrawingArrow(null);
  }, []);

  const clearArrows = useCallback(() => {
    setArrows([]);
  }, []);

  const clearLastArrow = useCallback(() => {
    setArrows(prev => prev.slice(0, -1));
  }, []);

  return {
    arrows,
    drawingArrow,
    startDrawing,
    finishDrawing,
    cancelDrawing,
    clearArrows,
    clearLastArrow
  };
};

