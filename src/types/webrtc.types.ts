export interface WebRTCMessage {
  type: string;
  payload: unknown;
  timestamp: number;
  fromPlayerId: string;
}

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'room-join' | 'room-leave';
  roomCode: string;
  data: unknown;
  fromPeerId: string;
  toPeerId?: string;
}

export interface PeerConnection {
  peerId: string;
  connection: RTCPeerConnection | null;
  dataChannel: RTCDataChannel | null;
  isConnected: boolean;
  playerId?: string;
}

