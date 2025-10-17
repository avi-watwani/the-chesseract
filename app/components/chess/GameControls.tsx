import React from 'react';
import { Flag, Scale, Volume2, VolumeX, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

interface GameControlsProps {
  mode: 'play' | 'analysis';
  onResign?: () => void;
  onDrawOffer?: () => void;
  onReset?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  mode,
  onResign,
  onDrawOffer,
  onReset,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  isSoundEnabled,
  onToggleSound
}) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex flex-col gap-3">
        {mode === 'play' && (
          <>
            <div className="flex gap-2">
              <button
                onClick={onResign}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30 transition-colors"
              >
                <Flag className="w-4 h-4" />
                Resign
              </button>
              <button
                onClick={onDrawOffer}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-500 rounded-md hover:bg-blue-500/30 transition-colors"
              >
                <Scale className="w-4 h-4" />
                Offer Draw
              </button>
            </div>
          </>
        )}
        
        {mode === 'analysis' && (
          <>
            <div className="flex gap-2">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-500 rounded-md hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipBack className="w-4 h-4" />
                Undo
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-500 rounded-md hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipForward className="w-4 h-4" />
                Redo
              </button>
            </div>
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 text-green-500 rounded-md hover:bg-green-500/30 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Board
            </button>
          </>
        )}
        
        <button
          onClick={onToggleSound}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700/20 text-gray-300 rounded-md hover:bg-gray-700/30 transition-colors"
        >
          {isSoundEnabled ? (
            <>
              <Volume2 className="w-4 h-4" />
              Sound On
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              Sound Off
            </>
          )}
        </button>
      </div>
    </div>
  );
};

