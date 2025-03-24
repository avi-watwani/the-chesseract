export type Piece = {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  color: 'white' | 'black';
};

export type Square = {
  piece: Piece | null;
  position: string;
}; 