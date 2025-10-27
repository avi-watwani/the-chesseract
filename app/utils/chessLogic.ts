import { Piece, Square } from '../types/chess';

type Position = { row: number; col: number };

export function isValidMove(
  board: Square[][], 
  from: Position, 
  to: Position, 
  piece: Piece,
  castlingRights?: { whiteKingside: boolean; whiteQueenside: boolean; blackKingside: boolean; blackQueenside: boolean }
): boolean {
  // Cannot capture your own pieces
  const targetPiece = board[to.row][to.col].piece;
  if (targetPiece && targetPiece.color === piece.color) {
    return false;
  }
  
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
      // Normal king move
      if (dx <= 1 && dy <= 1) {
        return true;
      }
      
      // Castling
      if (dy === 0 && dx === 2) {
        return canCastle(board, from, to, piece, castlingRights);
      }
      
      return false;

    default:
      return false;
  }
}

function canCastle(
  board: Square[][], 
  from: Position, 
  to: Position, 
  piece: Piece,
  castlingRights?: { whiteKingside: boolean; whiteQueenside: boolean; blackKingside: boolean; blackQueenside: boolean }
): boolean {
  // King must be on starting square
  const isWhite = piece.color === 'white';
  const startRow = isWhite ? 7 : 0;
  
  if (from.row !== startRow || from.col !== 4) {
    return false;
  }
  
  // Determine if it's kingside or queenside castling
  const isKingside = to.col === 6; // g-file
  const isQueenside = to.col === 2; // c-file
  
  if (!isKingside && !isQueenside) {
    return false;
  }
  
  // Check castling rights (if provided)
  if (castlingRights) {
    if (isWhite && isKingside && !castlingRights.whiteKingside) return false;
    if (isWhite && isQueenside && !castlingRights.whiteQueenside) return false;
    if (!isWhite && isKingside && !castlingRights.blackKingside) return false;
    if (!isWhite && isQueenside && !castlingRights.blackQueenside) return false;
  }
  
  // Check if rook is present
  const rookCol = isKingside ? 7 : 0;
  const rook = board[startRow][rookCol].piece;
  if (!rook || rook.type !== 'rook' || rook.color !== piece.color) {
    return false;
  }
  
  // Check if squares between king and rook are empty
  const startCol = Math.min(from.col, rookCol);
  const endCol = Math.max(from.col, rookCol);
  for (let col = startCol + 1; col < endCol; col++) {
    if (board[startRow][col].piece) {
      return false;
    }
  }
  
  // Check if king is in check
  if (isKingInCheck(board, piece.color)) {
    return false;
  }
  
  // Check if king passes through or ends in check
  const direction = isKingside ? 1 : -1;
  for (let i = 1; i <= 2; i++) {
    const testCol = from.col + (i * direction);
    const testBoard = JSON.parse(JSON.stringify(board));
    testBoard[from.row][testCol].piece = piece;
    testBoard[from.row][from.col].piece = null;
    
    if (isKingInCheck(testBoard, piece.color)) {
      return false;
    }
  }
  
  return true;
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

// Check if a move is legal (doesn't leave own king in check)
export function isLegalMove(
  board: Square[][], 
  from: Position, 
  to: Position, 
  piece: Piece,
  castlingRights?: { whiteKingside: boolean; whiteQueenside: boolean; blackKingside: boolean; blackQueenside: boolean }
): boolean {
  // First check if the move follows piece movement rules
  if (!isValidMove(board, from, to, piece, castlingRights)) {
    return false;
  }
  
  // Then simulate the move and check if it leaves the king in check
  const tempBoard = JSON.parse(JSON.stringify(board));
  tempBoard[to.row][to.col].piece = piece;
  tempBoard[from.row][from.col].piece = null;
  
  // Check if this move leaves our own king in check
  return !isKingInCheck(tempBoard, piece.color);
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
        // Map piece types to FEN notation
        const fenChar = piece.type === 'knight' ? 'n' : piece.type.charAt(0);
        fen += piece.color === 'white' ? fenChar.toUpperCase() : fenChar.toLowerCase();
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