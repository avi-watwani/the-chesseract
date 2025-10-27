'use client';

import React, { useRef } from 'react';
import { Square } from './Square';
import { Square as SquareType, Piece } from '../../types/chess';
import { Arrow } from '../../hooks/useArrows';

interface ChessBoardCoreProps {
  board: SquareType[][];
  selectedSquare: string | null;
  validMoves: string[];
  onSquareClick: (position: string) => void;
  orientation?: 'white' | 'black';
  isInteractive?: boolean;
  onPieceDrop?: (piece: Piece, position: string, sourcePosition?: string) => void;
  isDraggable?: boolean;
  arrows?: Arrow[];
  onSquareRightClick?: (position: string) => void;
  onSquareRightRelease?: (position: string) => void;
}

export const ChessBoardCore: React.FC<ChessBoardCoreProps> = ({
  board,
  selectedSquare,
  validMoves,
  onSquareClick,
  orientation = 'white',
  isInteractive = true,
  onPieceDrop,
  isDraggable = false,
  arrows = [],
  onSquareRightClick,
  onSquareRightRelease
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardToRender = orientation === 'black' 
    ? board.slice().reverse().map(row => row.slice().reverse()) 
    : board;

  // Convert chess position (e.g., "e4") to pixel coordinates
  const getSquareCenter = (position: string): { x: number; y: number } | null => {
    const file = position.charCodeAt(0) - 97; // a=0, b=1, ..., h=7
    const rank = parseInt(position[1]) - 1; // 1=0, 2=1, ..., 8=7
    
    // Adjust for orientation
    let col = orientation === 'black' ? 7 - file : file;
    let row = orientation === 'black' ? rank : 7 - rank;
    
    // Each square is 65px (w-[65px] h-[65px])
    const squareSize = 65;
    const x = col * squareSize + squareSize / 2;
    const y = row * squareSize + squareSize / 2;
    
    return { x, y };
  };

  // Render arrow SVG
  const renderArrow = (arrow: Arrow, index: number) => {
    const from = getSquareCenter(arrow.from);
    const to = getSquareCenter(arrow.to);
    
    if (!from || !to) return null;

    // If it's a circle (same square), render a circle instead of an arrow
    if (arrow.from === arrow.to) {
      return (
        <circle
          key={`arrow-${index}`}
          cx={from.x}
          cy={from.y}
          r={26}
          fill="none"
          stroke={arrow.color}
          strokeWidth={6}
          opacity={0.7}
          pointerEvents="none"
        />
      );
    }

    // Calculate arrow parameters
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Shorten the arrow so it doesn't cover the pieces completely
    const shortenStart = 20;
    const shortenEnd = 30;
    const startX = from.x + Math.cos(angle) * shortenStart;
    const startY = from.y + Math.sin(angle) * shortenStart;
    const endX = to.x - Math.cos(angle) * shortenEnd;
    const endY = to.y - Math.sin(angle) * shortenEnd;
    
    // Arrow head dimensions - bigger head
    const headLength = 28;
    const headWidth = 16;
    
    // Calculate arrowhead points
    const arrowTipX = endX + Math.cos(angle) * headLength;
    const arrowTipY = endY + Math.sin(angle) * headLength;
    
    const leftBaseX = endX - Math.sin(angle) * headWidth;
    const leftBaseY = endY + Math.cos(angle) * headWidth;
    
    const rightBaseX = endX + Math.sin(angle) * headWidth;
    const rightBaseY = endY - Math.cos(angle) * headWidth;
    
    return (
      <g key={`arrow-${index}`} opacity={0.75}>
        {/* Arrow line with shadow for depth - thinner body */}
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="rgba(0, 0, 0, 0.3)"
          strokeWidth={10}
          strokeLinecap="round"
          pointerEvents="none"
        />
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={arrow.color}
          strokeWidth={8}
          strokeLinecap="round"
          pointerEvents="none"
        />
        {/* Arrow head with shadow - bigger head */}
        <polygon
          points={`${arrowTipX},${arrowTipY} ${leftBaseX},${leftBaseY} ${rightBaseX},${rightBaseY}`}
          fill="rgba(0, 0, 0, 0.3)"
          transform={`translate(1.5, 1.5)`}
          pointerEvents="none"
        />
        <polygon
          points={`${arrowTipX},${arrowTipY} ${leftBaseX},${leftBaseY} ${rightBaseX},${rightBaseY}`}
          fill={arrow.color}
          pointerEvents="none"
        />
      </g>
    );
  };

  return (
    <div ref={boardRef} className="relative">
      <div className="grid grid-cols-8 gap-0 border-2 border-gray-700">
        {boardToRender.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((square, colIndex) => {
              const isLightSquare = (rowIndex + colIndex) % 2 === 0;
              const isSelected = selectedSquare === square.position;
              const isValidMove = validMoves.includes(square.position);
              
              return (
                <Square
                  key={square.position}
                  position={square.position}
                  piece={square.piece}
                  isLight={isLightSquare}
                  isSelected={isSelected}
                  isValidMove={isValidMove}
                  onClick={() => isInteractive && onSquareClick(square.position)}
                  onDrop={onPieceDrop}
                  isDraggable={isDraggable}
                  onRightMouseDown={onSquareRightClick}
                  onRightMouseUp={onSquareRightRelease}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      {/* SVG overlay for arrows */}
      {arrows.length > 0 && (
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          style={{ width: '520px', height: '520px' }}
          viewBox="0 0 520 520"
        >
          {arrows.map((arrow, index) => renderArrow(arrow, index))}
        </svg>
      )}
    </div>
  );
};

