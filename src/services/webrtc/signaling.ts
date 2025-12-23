import Peer, { Instance as PeerInstance } from 'peerjs';
import type { SignalingMessage } from '../../types/webrtc.types';

export class SignalingService {
  private peer: PeerInstance | null = null;
  private roomCode: string | null = null;
  private isHost: boolean = false;
  private messageHandlers: Map<string, (message: SignalingMessage) => void> = new Map();

  async initialize(peerId?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        this.peer = new Peer(peerId, {
          host: '0.peerjs.com',
          port: 443,
          path: '/',
          secure: true,
        });

        this.peer.on('open', (id) => {
          resolve(id);
        });

        this.peer.on('error', (error) => {
          reject(error);
        });

        this.peer.on('connection', (dataConnection) => {
          dataConnection.on('data', (data) => {
            const message = data as SignalingMessage;
            this.handleMessage(message);
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async createRoom(roomCode: string): Promise<void> {
    if (!this.peer) {
      await this.initialize();
    }
    this.roomCode = roomCode;
    this.isHost = true;
  }

  async joinRoom(roomCode: string, targetPeerId: string): Promise<void> {
    if (!this.peer) {
      await this.initialize();
    }
    this.roomCode = roomCode;
    this.isHost = false;

    const dataConnection = this.peer.connect(targetPeerId, {
      reliable: true,
    });

    dataConnection.on('open', () => {
      console.log('Connected to room:', roomCode);
    });

    dataConnection.on('data', (data) => {
      const message = data as SignalingMessage;
      this.handleMessage(message);
    });

    dataConnection.on('error', (error) => {
      console.error('Connection error:', error);
    });
  }

  sendMessage(message: SignalingMessage): void {
    if (!this.peer) {
      throw new Error('Peer not initialized');
    }

    // In a real implementation, this would send to all connected peers
    // For now, we'll use the peer's connections
    const connections = (this.peer as any).connections || [];
    connections.forEach((conn: any) => {
      if (conn.open) {
        conn.send(message);
      }
    });
  }

  onMessage(type: string, handler: (message: SignalingMessage) => void): void {
    this.messageHandlers.set(type, handler);
  }

  private handleMessage(message: SignalingMessage): void {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    }
  }

  getPeerId(): string | null {
    return this.peer?.id || null;
  }

  disconnect(): void {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.roomCode = null;
    this.isHost = false;
    this.messageHandlers.clear();
  }
}

export const signalingService = new SignalingService();

