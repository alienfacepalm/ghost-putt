import type { GameState, Player } from "../../types/game.types";

const FIRST_TO_HOLE_BONUS = 2;

export function calculateScore(strokes: number, par: number = 3): number {
  return strokes;
}

export function calculateTotalScore(
  scores: number[],
  firstToHole: Record<number, string | null>,
  playerId: string
): number {
  const baseScore = scores.reduce((sum, score) => sum + score, 0);
  const bonusPoints =
    Object.values(firstToHole).filter((winnerId) => winnerId === playerId)
      .length * FIRST_TO_HOLE_BONUS;
  return baseScore - bonusPoints; // Lower is better in golf
}

export function getNextPlayer(
  players: Player[],
  currentPlayerId: string | null
): Player | null {
  if (players.length === 0) return null;
  if (!currentPlayerId) return players[0];

  const currentIndex = players.findIndex((p) => p.id === currentPlayerId);
  if (currentIndex === -1) return players[0];

  const nextIndex = (currentIndex + 1) % players.length;
  return players[nextIndex];
}

export function checkHoleComplete(
  ballX: number,
  ballY: number,
  holeX: number,
  holeY: number,
  threshold: number = 20
): boolean {
  const distance = Math.sqrt(
    Math.pow(ballX - holeX, 2) + Math.pow(ballY - holeY, 2)
  );
  return distance < threshold;
}

export function isGameComplete(state: GameState): boolean {
  return state.currentHole > state.totalHoles;
}

export function canPlaceObstacle(state: GameState, playerId: string): boolean {
  const currentHole = state.course?.holes.find(
    (h) => h.number === state.currentHole
  );
  if (!currentHole) return false;

  // Check if player already placed an obstacle this hole
  const hasPlaced = state.playerObstacles.some(
    (obs) =>
      obs.playerId === playerId &&
      currentHole.playerObstacles.some((po) => po.id === obs.id)
  );

  return !hasPlaced;
}

export function getPlayerColor(playerId: string, index: number): string {
  const colors = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Amber
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#F97316", // Orange
  ];
  // Handle negative indices properly
  const normalizedIndex =
    ((index % colors.length) + colors.length) % colors.length;
  return colors[normalizedIndex];
}
