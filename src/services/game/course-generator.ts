import type { Course, Hole, Obstacle, CourseGenerationParams } from '../../types/course.types';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const HOLE_RADIUS = 15;
const BALL_RADIUS = 10;
const MIN_DISTANCE = 200; // Minimum distance from start to hole

export function generateCourse(): Course {
  const holes: Hole[] = [];
  
  for (let i = 1; i <= 3; i++) {
    holes.push(generateHole(i, i)); // Difficulty increases with hole number
  }
  
  return {
    id: `course-${Date.now()}`,
    holes,
    generatedAt: Date.now(),
  };
}

function generateHole(holeNumber: number, difficulty: number): Hole {
  const params: CourseGenerationParams = {
    holeNumber,
    difficulty,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    minObstacles: Math.floor(difficulty * 2),
    maxObstacles: Math.floor(difficulty * 4),
  };
  
  // Generate start and hole positions
  const startPosition = generateStartPosition();
  const holePosition = generateHolePosition(startPosition, difficulty);
  
  // Generate base obstacles
  const obstacles = generateObstacles(params, startPosition, holePosition);
  
  return {
    number: holeNumber,
    startPosition,
    holePosition,
    obstacles,
    playerObstacles: [],
    difficulty,
  };
}

function generateStartPosition(): { x: number; y: number } {
  // Start in top-left area
  const margin = 100;
  return {
    x: margin + Math.random() * 200,
    y: margin + Math.random() * 200,
  };
}

function generateHolePosition(
  startPosition: { x: number; y: number },
  difficulty: number
): { x: number; y: number } {
  // Hole should be far enough away and in different quadrant
  const margin = 100;
  let attempts = 0;
  let position: { x: number; y: number };
  
  do {
    // Place hole in bottom-right area for easier courses, more random for harder
    if (difficulty === 1) {
      position = {
        x: CANVAS_WIDTH - margin - Math.random() * 200,
        y: CANVAS_HEIGHT - margin - Math.random() * 200,
      };
    } else {
      position = {
        x: margin + Math.random() * (CANVAS_WIDTH - margin * 2),
        y: margin + Math.random() * (CANVAS_HEIGHT - margin * 2),
      };
    }
    attempts++;
  } while (
    getDistance(startPosition, position) < MIN_DISTANCE && 
    attempts < 10
  );
  
  return position;
}

function generateObstacles(
  params: CourseGenerationParams,
  startPosition: { x: number; y: number },
  holePosition: { x: number; y: number }
): Obstacle[] {
  const obstacles: Obstacle[] = [];
  const numObstacles = params.minObstacles! + 
    Math.floor(Math.random() * (params.maxObstacles! - params.minObstacles! + 1));
  
  for (let i = 0; i < numObstacles; i++) {
    const obstacle = generateObstacle(params, startPosition, holePosition, obstacles);
    if (obstacle) {
      obstacles.push(obstacle);
    }
  }
  
  return obstacles;
}

function generateObstacle(
  params: CourseGenerationParams,
  startPosition: { x: number; y: number },
  holePosition: { x: number; y: number },
  existingObstacles: Obstacle[]
): Obstacle | null {
  const types: Obstacle['type'][] = ['wall', 'ramp', 'bumper'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const margin = 50;
  let attempts = 0;
  let position: { x: number; y: number };
  let width: number;
  let height: number;
  
  do {
    position = {
      x: margin + Math.random() * (params.width - margin * 2),
      y: margin + Math.random() * (params.height - margin * 2),
    };
    
    // Size based on type
    if (type === 'wall') {
      width = 20 + Math.random() * 80;
      height = 100 + Math.random() * 200;
    } else if (type === 'ramp') {
      width = 80 + Math.random() * 120;
      height = 20 + Math.random() * 40;
    } else {
      width = 40;
      height = 40;
    }
    
    attempts++;
  } while (
    (isTooCloseToPosition(position, startPosition, Math.max(width, height) + 50) ||
     isTooCloseToPosition(position, holePosition, Math.max(width, height) + 50) ||
     isOverlapping(position, width, height, existingObstacles)) &&
    attempts < 20
  );
  
  if (attempts >= 20) return null;
  
  return {
    id: `obstacle-${Date.now()}-${Math.random()}`,
    type,
    position,
    width,
    height,
    rotation: type === 'wall' ? Math.random() * 360 : 0,
  };
}

function isTooCloseToPosition(
  obstaclePos: { x: number; y: number },
  targetPos: { x: number; y: number },
  minDistance: number
): boolean {
  return getDistance(obstaclePos, targetPos) < minDistance;
}

function isOverlapping(
  position: { x: number; y: number },
  width: number,
  height: number,
  existingObstacles: Obstacle[]
): boolean {
  return existingObstacles.some(obs => {
    const dist = getDistance(position, obs.position);
    const minDist = Math.max(width, height) / 2 + Math.max(obs.width, obs.height) / 2 + 20;
    return dist < minDist;
  });
}

function getDistance(
  pos1: { x: number; y: number },
  pos2: { x: number; y: number }
): number {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

