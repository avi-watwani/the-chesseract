export interface GameState {
  players: Map<string, 'white' | 'black'>;
  currentTurn: 'white' | 'black';
  moves: Array<{
    from: string;
    to: string;
    player: 'white' | 'black';
  }>;
  status: 'waiting' | 'playing' | 'resigned' | 'draw';
}

export interface GameEndEvent {
  type: 'resignation' | 'checkmate' | 'stalemate' | 'draw';
  winner?: 'white' | 'black';
} 