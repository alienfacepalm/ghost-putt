import React, { useRef, useEffect } from 'react';
import { usePhysics } from '../../hooks/use-physics';
import { useGameStore } from '../../store/game-store';
import { GhostBall } from './ghost-ball';

interface GameCanvasProps {
  onBallStop?: () => void;
  onHoleComplete?: () => void;
}

export function GameCanvas({ onBallStop, onHoleComplete }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { course, currentHole, ghostBalls } = useGameStore();
  
  const currentHoleData = course?.holes.find(h => h.number === currentHole);
  
  const { takeShot, getBallPosition } = usePhysics(
    canvasRef,
    currentHoleData || null,
    onBallStop,
    onHoleComplete
  );

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        className="border-2 border-gray-300 rounded-lg bg-sky-200"
      />
      {ghostBalls.map((ghostBall) => (
        <GhostBall
          key={ghostBall.playerId}
          ghostBall={ghostBall}
        />
      ))}
    </div>
  );
}

