import React from 'react';
import { Flag, Scale, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Piece } from '../types/chess';

interface ChessControlsProps {
  moveHistory: string[];
  capturedPieces: {
    white: Piece[];
    black: Piece[];
  };
  onResign: () => void;
  onDrawOffer: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  isAnalysisMode?: boolean;
  onReset?: () => void;
}

const ChessControls: React.FC<ChessControlsProps> = ({
  moveHistory,
  capturedPieces,
  onResign,
  onDrawOffer,
  isSoundEnabled,
  onToggleSound,
  isAnalysisMode = false,
  onReset
}) => {
  return (
    <div className="w-full max-w-xl mx-auto mt-4 grid grid-cols-2 gap-4">
      {/* Left column: Move history */}
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-200 mb-2">Move History</h3>
        <div className="h-48 overflow-y-auto">
          {moveHistory.map((move, index) => (
            <div key={index} className="flex text-gray-300 py-1">
              <span className="w-8 text-gray-500">{Math.floor(index / 2) + 1}.</span>
              <span className="flex-1">{move}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column: Captured pieces and controls */}
      <div className="space-y-4">
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Captured Pieces</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-white">White:</span>
              <div className="flex gap-1">
                {capturedPieces.white.map((piece, index) => (
                  <div key={index} className="w-6 h-6">
                    {/* Piece SVG will be rendered here */}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">Black:</span>
              <div className="flex gap-1">
                {capturedPieces.black.map((piece, index) => (
                  <div key={index} className="w-6 h-6">
                    {/* Piece SVG will be rendered here */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 flex justify-between">
          {!isAnalysisMode && (
            <>
              <button
                onClick={onResign}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30 transition-colors"
              >
                <Flag className="w-4 h-4" />
                Resign
              </button>
              <button
                onClick={onDrawOffer}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-500 rounded-md hover:bg-blue-500/30 transition-colors"
              >
                <Scale className="w-4 h-4" />
                Offer Draw
              </button>
            </>
          )}
          {isAnalysisMode && onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-500 rounded-md hover:bg-green-500/30 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Board
            </button>
          )}
          <button
            onClick={onToggleSound}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700/20 text-gray-300 rounded-md hover:bg-gray-700/30 transition-colors"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChessControls; 