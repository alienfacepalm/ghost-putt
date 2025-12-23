import { useEffect } from "react";
import { useGameStore } from "../store/game-store";
import { useWebRTC } from "./use-webrtc";
import { usePlayerStore } from "../store/player-store";

export function useGameState() {
  const gameStore = useGameStore();
  const playerStore = usePlayerStore();
  const { broadcastState, broadcastGhostBall, isConnected } = useWebRTC(
    playerStore.currentPlayer?.id || ""
  );

  // Broadcast state updates when host
  useEffect(() => {
    if (!isConnected || !playerStore.currentPlayer?.isHost) return;

    const interval = setInterval(() => {
      broadcastState();
    }, 1000); // Broadcast state every second

    return () => clearInterval(interval);
  }, [isConnected, playerStore.currentPlayer?.isHost, broadcastState]);

  // Broadcast ghost ball updates
  const updateGhostBall = (position: {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    isMoving: boolean;
  }): void => {
    if (!isConnected || !playerStore.currentPlayer) return;

    broadcastGhostBall(position);

    // Update local ghost ball
    gameStore.updateGhostBall(playerStore.currentPlayer.id, position);
  };

  return {
    ...gameStore,
    updateGhostBall,
  };
}
