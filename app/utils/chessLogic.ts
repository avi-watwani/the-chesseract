import { Piece, Square } from '../types/chess';

type Position = { row: number; col: number };

export function isValidMove(board: Square[][], from: Position, to: Position, piece: Piece): boolean {
  const dx = Math.abs(to.col - from.col);
  const dy = Math.abs(to.row - from.row);
  
  switch (piece.type) {
    case 'pawn':
      const direction = piece.color === 'white' ? -1 : 1;
      const startRank = piece.color === 'white' ? 6 : 1;
      
      // Basic pawn move
      if (to.col === from.col && !board[to.row][to.col].piece) {
        if (to.row === from.row + direction) return true;
        // Double move from starting position
        if (from.row === startRank && to.row === from.row + 2 * direction && !board[from.row + direction][from.col].piece) {
          return true;
        }
      }
      
      // Capture
      if (Math.abs(to.col - from.col) === 1 && to.row === from.row + direction) {
        if (board[to.row][to.col].piece && board[to.row][to.col].piece?.color !== piece.color) {
          return true;
        }
      }
      return false;

    case 'knight':
      return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);

    case 'bishop':
      return dx === dy && isPathClear(board, from, to);

    case 'rook':
      return (dx === 0 || dy === 0) && isPathClear(board, from, to);

    case 'queen':
      return (dx === dy || dx === 0 || dy === 0) && isPathClear(board, from, to);

    case 'king':
      return dx <= 1 && dy <= 1;

    default:
      return false;
  }
}

function isPathClear(board: Square[][], from: Position, to: Position): boolean {
  const dx = Math.sign(to.col - from.col);
  const dy = Math.sign(to.row - from.row);
  let x = from.col + dx;
  let y = from.row + dy;

  while (x !== to.col || y !== to.row) {
    if (board[y][x].piece) return false;
    x += dx;
    y += dy;
  }

  return true;
}

export function isKingInCheck(board: Square[][], color: 'white' | 'black'): boolean {
  // Find king position
  let kingPos: Position | null = null;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col].piece;
      if (piece?.type === 'king' && piece.color === color) {
        kingPos = { row, col };
        break;
      }
    }
    if (kingPos) break;
  }

  if (!kingPos) return false;

  // Check if any opponent piece can capture the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col].piece;
      if (piece && piece.color !== color) {
        if (isValidMove(board, { row, col }, kingPos, piece)) {
          return true;
        }
      }
    }
  }

  return false;
}

export function isCheckmate(board: Square[][], color: 'white' | 'black'): boolean {
  if (!isKingInCheck(board, color)) return false;

  // Try all possible moves for all pieces
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol].piece;
      if (piece?.color === color) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(board, { row: fromRow, col: fromCol }, { row: toRow, col: toCol }, piece)) {
              // Try the move
              const tempBoard = JSON.parse(JSON.stringify(board));
              tempBoard[toRow][toCol].piece = piece;
              tempBoard[fromRow][fromCol].piece = null;
              
              // If this move gets us out of check, it's not checkmate
              if (!isKingInCheck(tempBoard, color)) {
                return false;
              }
            }
          }
        }
      }
    }
  }

  return true;
}

export function isStalemate(board: Square[][], color: 'white' | 'black'): boolean {
  if (isKingInCheck(board, color)) return false;

  // Check if any legal moves exist
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol].piece;
      if (piece?.color === color) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(board, { row: fromRow, col: fromCol }, { row: toRow, col: toCol }, piece)) {
              // Try the move
              const tempBoard = JSON.parse(JSON.stringify(board));
              tempBoard[toRow][toCol].piece = piece;
              tempBoard[fromRow][fromCol].piece = null;
              
              // If this move doesn't put us in check, it's a legal move
              if (!isKingInCheck(tempBoard, color)) {
                return false;
              }
            }
          }
        }
      }
    }
  }

  return true;
}

export function generateFEN(board: Square[][], activeColor: 'w' | 'b', castling: string, enPassant: string, halfmoveClock: number, fullmoveNumber: number): string {
  let fen = '';
  for (let row = 0; row < 8; row++) {
    let emptyCount = 0;
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col].piece;
      if (piece) {
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        fen += piece.color === 'white' ? piece.type.toUpperCase() : piece.type.toLowerCase();
      } else {
        emptyCount++;
      }
    }
    if (emptyCount > 0) fen += emptyCount;
    if (row < 7) fen += '/';
  }
  return `${fen} ${activeColor} ${castling} ${enPassant} ${halfmoveClock} ${fullmoveNumber}`;
}

export function generatePGN(moveHistory: string[], metadata: { [key: string]: string }): string {
  let pgn = '';
  for (const [key, value] of Object.entries(metadata)) {
    pgn += `[${key} "${value}"]\n`;
  }
  pgn += '\n';
  moveHistory.forEach((move, index) => {
    if (index % 2 === 0) pgn += `${Math.floor(index / 2) + 1}. `;
    pgn += `${move} `;
  });
  return pgn.trim();
}