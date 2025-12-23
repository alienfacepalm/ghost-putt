import { useEffect, useRef } from 'react';
import * as Matter from 'matter-js';
import type { Hole } from '../types/course.types';
import {
  createBall,
  createHole,
  createObstacleBody,
  applyForceToBall,
  isBallInHole,
  isBallMoving,
} from '../services/game/collision-handler';

export function usePhysics(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  hole: Hole | null,
  onBallStop?: () => void,
  onHoleComplete?: () => void
) {
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const ballRef = useRef<Matter.Body | null>(null);
  const holeRef = useRef<Matter.Body | null>(null);
  const obstaclesRef = useRef<Matter.Body[]>([]);

  useEffect(() => {
    if (!canvasRef.current || !hole) return;

    // Create engine
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 0.5; // Light gravity
    engineRef.current = engine;

    // Create renderer
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 1200,
        height: 800,
        wireframes: false,
        background: '#87CEEB',
      },
    });
    Matter.Render.run(render);
    renderRef.current = render;

    // Create ball
    const ball = createBall(engine, hole.startPosition.x, hole.startPosition.y);
    Matter.World.add(engine.world, ball);
    ballRef.current = ball;

    // Create hole
    const holeBody = createHole(engine, hole.holePosition.x, hole.holePosition.y);
    Matter.World.add(engine.world, holeBody);
    holeRef.current = holeBody;

    // Create obstacles
    const obstacles: Matter.Body[] = [];
    [...hole.obstacles, ...hole.playerObstacles].forEach((obstacle) => {
      const body = createObstacleBody(engine, obstacle);
      if (body) {
        Matter.World.add(engine.world, body);
        obstacles.push(body);
      }
    });
    obstaclesRef.current = obstacles;

    // Create boundaries
    const boundaries = [
      Matter.Bodies.rectangle(600, 0, 1200, 20, { isStatic: true }), // Top
      Matter.Bodies.rectangle(600, 800, 1200, 20, { isStatic: true }), // Bottom
      Matter.Bodies.rectangle(0, 400, 20, 800, { isStatic: true }), // Left
      Matter.Bodies.rectangle(1200, 400, 20, 800, { isStatic: true }), // Right
    ];
    Matter.World.add(engine.world, boundaries);

    // Run engine
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Check for ball stopping and hole completion
    const checkInterval = setInterval(() => {
      if (!ballRef.current || !holeRef.current) return;

      if (isBallInHole(ballRef.current, holeRef.current)) {
        onHoleComplete?.();
        clearInterval(checkInterval);
      } else if (!isBallMoving(ballRef.current) && onBallStop) {
        onBallStop();
      }
    }, 100);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      clearInterval(checkInterval);
    };
  }, [canvasRef, hole, onBallStop, onHoleComplete]);

  const takeShot = (angle: number, power: number): void => {
    if (!ballRef.current) return;
    applyForceToBall(ballRef.current, angle, power);
  };

  const getBallPosition = (): { x: number; y: number; velocityX: number; velocityY: number; isMoving: boolean } | null => {
    if (!ballRef.current) return null;
    return {
      x: ballRef.current.position.x,
      y: ballRef.current.position.y,
      velocityX: ballRef.current.velocity.x,
      velocityY: ballRef.current.velocity.y,
      isMoving: isBallMoving(ballRef.current),
    };
  };

  return {
    takeShot,
    getBallPosition,
  };
}

