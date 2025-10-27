import React from 'react';

interface MoveHistoryProps {
  moves: string[];
  className?: string;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves, className = '' }) => {
  return (
    <div className={`bg-gray-900 rounded-lg p-3 flex flex-col ${className}`}>
      <h3 className="text-sm font-semibold text-gray-200 mb-2">Move History</h3>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-0.5">
          {moves.length === 0 ? (
            <p className="text-gray-500 text-xs text-center py-4">No moves yet</p>
          ) : (
            Array.from({ length: Math.ceil(moves.length / 2) }, (_, index) => {
              const whiteMove = moves[index * 2];
              const blackMove = moves[index * 2 + 1];
              const moveNumber = index + 1;
              
              return (
                <div key={index} className="flex items-center text-gray-300 text-xs py-1 hover:bg-gray-800 rounded px-2">
                  <span className="w-6 text-gray-500 font-semibold">{moveNumber}.</span>
                  <div className="flex-1 flex gap-3">
                    <span className="flex-1">{whiteMove || ''}</span>
                    <span className="flex-1">{blackMove || ''}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

