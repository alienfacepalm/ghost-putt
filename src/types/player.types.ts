export interface Player {
  id: string;
  name: string;
  color: string;
  isHost: boolean;
  joinedAt: number;
}

export interface PlayerConnection {
  playerId: string;
  peerId: string;
  isConnected: boolean;
  lastSeen: number;
}

