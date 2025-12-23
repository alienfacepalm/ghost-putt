export interface GameState {
  currentHole: number;
  totalHoles: number;
  players: Player[];
  scores: Record<string, number[]>; // playerId -> scores per hole
  gameStatus: 'lobby' | 'playing' | 'finished';
  currentPlayerId: string | null;
  ballPositions: Record<string, BallPosition>; // playerId -> ball position
  ghostBalls: GhostBall[]; // Active ghost balls for visualization
  course: Course | null;
  playerObstacles: PlayerObstacle[]; // Obstacles placed by players
  firstToHole: Record<number, string | null>; // hole number -> playerId who finished first
}

export interface Player {
  id: string;
  name: string;
  color: string; // Color for ghost ball visualization
  isHost: boolean;
  joinedAt: number;
}

export interface BallPosition {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  isMoving: boolean;
}

export interface GhostBall {
  playerId: string;
  playerName: string;
  color: string;
  position: BallPosition;
  lastUpdate: number;
}

export interface Course {
  holes: Hole[];
  id: string;
  generatedAt: number;
}

export interface Hole {
  number: number;
  startPosition: { x: number; y: number };
  holePosition: { x: number; y: number };
  obstacles: Obstacle[];
  playerObstacles: PlayerObstacle[];
  difficulty: number;
}

export interface Obstacle {
  id: string;
  type: 'wall' | 'ramp' | 'moving' | 'bumper';
  position: { x: number; y: number };
  width: number;
  height: number;
  rotation?: number;
}

export interface PlayerObstacle extends Obstacle {
  playerId: string;
  playerName: string;
  placedAt: number;
}

export interface GameMessage {
  type: 'state-update' | 'ghost-ball-update' | 'obstacle-placed' | 'player-joined' | 'player-left' | 'shot-taken' | 'hole-completed';
  payload: unknown;
  timestamp: number;
  fromPlayerId: string;
}

