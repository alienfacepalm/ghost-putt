import * as Matter from "matter-js";
import type { Obstacle, PlayerObstacle } from "../../types/course.types";

export function createBall(
  _engine: Matter.Engine,
  x: number,
  y: number,
  radius: number = 10
): Matter.Body {
  return Matter.Bodies.circle(x, y, radius, {
    restitution: 0.7,
    friction: 0.1,
    frictionAir: 0.01,
    density: 0.001,
    render: {
      fillStyle: "#FFFFFF",
      strokeStyle: "#000000",
      lineWidth: 2,
    },
  });
}

export function createHole(
  _engine: Matter.Engine,
  x: number,
  y: number,
  radius: number = 15
): Matter.Body {
  return Matter.Bodies.circle(x, y, radius, {
    isStatic: true,
    isSensor: true,
    render: {
      fillStyle: "#000000",
      opacity: 0.8,
    },
  });
}

export function createWall(
  _engine: Matter.Engine,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number = 0
): Matter.Body {
  return Matter.Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    angle: rotation,
    render: {
      fillStyle: "#8B5A3C",
      strokeStyle: "#654321",
      lineWidth: 2,
    },
  });
}

export function createRamp(
  _engine: Matter.Engine,
  x: number,
  y: number,
  width: number,
  height: number
): Matter.Body {
  return Matter.Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: {
      fillStyle: "#D4A574",
      strokeStyle: "#8B6914",
      lineWidth: 2,
    },
  });
}

export function createBumper(
  _engine: Matter.Engine,
  x: number,
  y: number,
  radius: number = 20
): Matter.Body {
  return Matter.Bodies.circle(x, y, radius, {
    isStatic: true,
    restitution: 1.5,
    render: {
      fillStyle: "#FFD700",
      strokeStyle: "#FFA500",
      lineWidth: 2,
    },
  });
}

export function createObstacleBody(
  engine: Matter.Engine,
  obstacle: Obstacle | PlayerObstacle
): Matter.Body | null {
  switch (obstacle.type) {
    case "wall":
      return createWall(
        engine,
        obstacle.position.x,
        obstacle.position.y,
        obstacle.width,
        obstacle.height,
        obstacle.rotation || 0
      );
    case "ramp":
      return createRamp(
        engine,
        obstacle.position.x,
        obstacle.position.y,
        obstacle.width,
        obstacle.height
      );
    case "bumper":
      return createBumper(engine, obstacle.position.x, obstacle.position.y);
    default:
      return null;
  }
}

export function applyForceToBall(
  ball: Matter.Body,
  angle: number,
  power: number
): void {
  const forceX = Math.cos(angle) * power;
  const forceY = Math.sin(angle) * power;
  Matter.Body.applyForce(ball, ball.position, { x: forceX, y: forceY });
}

export function isBallInHole(
  ball: Matter.Body,
  hole: Matter.Body,
  threshold: number = 20
): boolean {
  const distance = Matter.Vector.magnitude(
    Matter.Vector.sub(ball.position, hole.position)
  );
  return distance < threshold;
}

export function isBallMoving(
  ball: Matter.Body,
  threshold: number = 0.5
): boolean {
  const velocity = Matter.Vector.magnitude(ball.velocity);
  return velocity > threshold;
}
