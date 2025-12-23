import { useEffect, useRef, useState } from 'react';
import { PeerManager } from '../services/webrtc/peer-manager';
import { useConnectionStore } from '../store/connection-store';
import { useGameStore } from '../store/game-store';
import { createGameMessage } from '../services/webrtc/message-handler';

export function useWebRTC(playerId: string) {
  const peerManagerRef = useRef<PeerManager | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { setRoomCode, setIsHost, setIsConnected: setStoreConnected } = useConnectionStore();
  const gameStore = useGameStore();

  useEffect(() => {
    if (!playerId) return;

    peerManagerRef.current = new PeerManager(playerId);

    return () => {
      peerManagerRef.current?.disconnect();
    };
  }, [playerId]);

  const createRoom = async (roomCode: string): Promise<void> => {
    if (!peerManagerRef.current) return;
    
    try {
      await peerManagerRef.current.createHostConnection(roomCode);
      setRoomCode(roomCode);
      setIsHost(true);
      setIsConnected(true);
      setStoreConnected(true);
    } catch (error) {
      console.error('Failed to create room:', error);
      throw error;
    }
  };

  const joinRoom = async (roomCode: string, hostPeerId: string): Promise<void> => {
    if (!peerManagerRef.current) return;
    
    try {
      await peerManagerRef.current.joinRoom(roomCode, hostPeerId);
      setRoomCode(roomCode);
      setIsHost(false);
      setIsConnected(true);
      setStoreConnected(true);
    } catch (error) {
      console.error('Failed to join room:', error);
      throw error;
    }
  };

  const broadcastState = (): void => {
    if (!peerManagerRef.current || !isConnected) return;
    
    const state = gameStore;
    const message = createGameMessage('state-update', state, playerId);
    peerManagerRef.current.broadcast(message);
  };

  const broadcastGhostBall = (position: { x: number; y: number; velocityX: number; velocityY: number; isMoving: boolean }): void => {
    if (!peerManagerRef.current || !isConnected) return;
    
    const message = createGameMessage('ghost-ball-update', {
      playerId,
      position,
    }, playerId);
    peerManagerRef.current.broadcast(message);
  };

  const disconnect = (): void => {
    peerManagerRef.current?.disconnect();
    setIsConnected(false);
    setStoreConnected(false);
    setRoomCode(null);
    setIsHost(false);
  };

  return {
    isConnected,
    createRoom,
    joinRoom,
    broadcastState,
    broadcastGhostBall,
    disconnect,
  };
}

