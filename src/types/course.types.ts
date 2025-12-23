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

export interface CourseGenerationParams {
  holeNumber: number;
  difficulty: number;
  width: number;
  height: number;
  minObstacles?: number;
  maxObstacles?: number;
}

