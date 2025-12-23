import { create } from 'zustand';
import type { PeerConnection } from '../types/webrtc.types';

interface ConnectionStore {
  connections: Map<string, PeerConnection>;
  isHost: boolean;
  roomCode: string | null;
  isConnected: boolean;
  addConnection: (peerId: string, connection: PeerConnection) => void;
  removeConnection: (peerId: string) => void;
  updateConnection: (peerId: string, updates: Partial<PeerConnection>) => void;
  setIsHost: (isHost: boolean) => void;
  setRoomCode: (roomCode: string | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  reset: () => void;
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  connections: new Map(),
  isHost: false,
  roomCode: null,
  isConnected: false,
  
  addConnection: (peerId, connection) => set((state) => {
    const newConnections = new Map(state.connections);
    newConnections.set(peerId, connection);
    return { connections: newConnections };
  }),
  
  removeConnection: (peerId) => set((state) => {
    const newConnections = new Map(state.connections);
    newConnections.delete(peerId);
    return { connections: newConnections };
  }),
  
  updateConnection: (peerId, updates) => set((state) => {
    const newConnections = new Map(state.connections);
    const existing = newConnections.get(peerId);
    if (existing) {
      newConnections.set(peerId, { ...existing, ...updates });
    }
    return { connections: newConnections };
  }),
  
  setIsHost: (isHost) => set({ isHost }),
  setRoomCode: (roomCode) => set({ roomCode }),
  setIsConnected: (isConnected) => set({ isConnected }),
  
  reset: () => set({
    connections: new Map(),
    isHost: false,
    roomCode: null,
    isConnected: false,
  }),
}));

