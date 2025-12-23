import React, { useState } from 'react';
import { useGameStore } from '../../store/game-store';
import { usePlayerStore } from '../../store/player-store';
import { canPlaceObstacle } from '../../services/game/game-logic';
import { Button } from '../ui/button';
import type { PlayerObstacle } from '../../types/course.types';

interface ObstaclePlacerProps {
  onObstaclePlaced: (obstacle: PlayerObstacle) => void;
}

export function ObstaclePlacer({ onObstaclePlaced }: ObstaclePlacerProps) {
  const { currentHole, playerObstacles, course } = useGameStore();
  const { currentPlayer } = usePlayerStore();
  const [selectedType, setSelectedType] = useState<'wall' | 'ramp' | 'bumper'>('wall');
  const [isPlacing, setIsPlacing] = useState(false);

  if (!currentPlayer) return null;

  const canPlace = canPlaceObstacle(useGameStore.getState(), currentPlayer.id);

  const handlePlaceObstacle = () => {
    if (!canPlace || !currentPlayer) return;

    // In a real implementation, this would open a placement UI
    // For now, we'll place at a random position
    const obstacle: PlayerObstacle = {
      id: `player-obstacle-${Date.now()}`,
      type: selectedType,
      position: {
        x: 400 + Math.random() * 400,
        y: 300 + Math.random() * 200,
      },
      width: selectedType === 'wall' ? 60 : selectedType === 'ramp' ? 100 : 40,
      height: selectedType === 'wall' ? 150 : selectedType === 'ramp' ? 30 : 40,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      placedAt: Date.now(),
    };

    onObstaclePlaced(obstacle);
    setIsPlacing(false);
  };

  if (!canPlace) {
    return (
      <div className="text-sm text-gray-500">
        You've already placed an obstacle this hole
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-3">Place Obstacle</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Obstacle Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="wall">Wall</option>
            <option value="ramp">Ramp</option>
            <option value="bumper">Bumper</option>
          </select>
        </div>
        <Button onClick={handlePlaceObstacle} className="w-full">
          Place {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
        </Button>
      </div>
    </div>
  );
}

