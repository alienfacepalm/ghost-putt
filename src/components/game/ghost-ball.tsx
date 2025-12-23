import React from 'react';
import type { GhostBall as GhostBallType } from '../../types/game.types';

interface GhostBallProps {
  ghostBall: GhostBallType;
}

export function GhostBall({ ghostBall }: GhostBallProps) {
  // Ghost balls are rendered on the canvas by Matter.js
  // This component is a placeholder for future UI enhancements
  return null;
}

