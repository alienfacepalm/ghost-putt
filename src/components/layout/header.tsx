import React from 'react';
import { useGameStore } from '../../store/game-store';
import { usePlayerStore } from '../../store/player-store';

export function Header() {
  const { currentHole, totalHoles, players, scores } = useGameStore();
  const { currentPlayer } = usePlayerStore();

  return (
    <header className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">GhostPutt</h1>
          <p className="text-sm text-gray-600">
            Hole {currentHole} of {totalHoles}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {currentPlayer && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Playing as</p>
              <p className="font-semibold text-gray-800">{currentPlayer.name}</p>
            </div>
          )}
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Players</p>
            <p className="font-semibold text-gray-800">{players.length}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

