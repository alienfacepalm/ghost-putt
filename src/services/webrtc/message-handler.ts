import type { GameMessage, WebRTCMessage } from '../../types/webrtc.types';
import { useGameStore } from '../../store/game-store';
import { useConnectionStore } from '../../store/connection-store';

export function handleGameMessage(message: WebRTCMessage): void {
  const gameStore = useGameStore.getState();
  const connectionStore = useConnectionStore.getState();

  switch (message.type) {
    case 'state-update':
      // Host sends full state update
      if (connectionStore.isHost) return; // Host doesn't process their own updates
      const stateUpdate = message.payload as Partial<typeof gameStore>;
      // Apply state update (simplified - in real implementation, merge carefully)
      break;

    case 'ghost-ball-update':
      const ghostBallUpdate = message.payload as {
        playerId: string;
        position: { x: number; y: number; velocityX: number; velocityY: number; isMoving: boolean };
      };
      gameStore.updateGhostBall(ghostBallUpdate.playerId, ghostBallUpdate.position);
      break;

    case 'obstacle-placed':
      const obstacleUpdate = message.payload as any;
      gameStore.addPlayerObstacle(obstacleUpdate);
      break;

    case 'player-joined':
      const playerJoined = message.payload as any;
      gameStore.addPlayer(playerJoined);
      break;

    case 'player-left':
      const playerLeft = message.payload as { playerId: string };
      gameStore.removePlayer(playerLeft.playerId);
      break;

    case 'shot-taken':
      // Handle shot taken event
      break;

    case 'hole-completed':
      const holeCompleted = message.payload as { playerId: string; hole: number };
      if (!gameStore.firstToHole[holeCompleted.hole]) {
        gameStore.setFirstToHole(holeCompleted.hole, holeCompleted.playerId);
      }
      break;

    default:
      console.warn('Unknown message type:', message.type);
  }
}

export function createGameMessage(
  type: GameMessage['type'],
  payload: unknown,
  fromPlayerId: string
): GameMessage {
  return {
    type,
    payload,
    timestamp: Date.now(),
    fromPlayerId,
  };
}

