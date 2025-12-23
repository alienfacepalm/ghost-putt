import SimplePeer, { Instance } from 'simple-peer';
import type { PeerConnection } from '../../types/webrtc.types';
import { signalingService } from './signaling';
import { handleGameMessage } from './message-handler';
import { createGameMessage } from './message-handler';

const STUN_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export class PeerManager {
  private peers: Map<string, Instance> = new Map();
  private playerId: string;
  private isHost: boolean = false;

  constructor(playerId: string) {
    this.playerId = playerId;
  }

  async createHostConnection(roomCode: string): Promise<void> {
    this.isHost = true;
    const peerId = await signalingService.initialize();
    await signalingService.createRoom(roomCode);
    
    // Host waits for connections
    signalingService.onMessage('room-join', (message) => {
      this.handleIncomingConnection(message.fromPeerId);
    });
  }

  async joinRoom(roomCode: string, hostPeerId: string): Promise<void> {
    this.isHost = false;
    await signalingService.initialize();
    await signalingService.joinRoom(roomCode, hostPeerId);
    
    // Joiner initiates connection
    this.createPeerConnection(hostPeerId, true);
  }

  private createPeerConnection(targetPeerId: string, initiator: boolean): void {
    const peer = new SimplePeer({
      initiator,
      trickle: false,
      config: {
        iceServers: STUN_SERVERS,
      },
    });

    peer.on('signal', (data) => {
      // Send signaling data through signaling service
      signalingService.sendMessage({
        type: initiator ? 'offer' : 'answer',
        roomCode: signalingService.getPeerId() || '',
        data,
        fromPeerId: this.playerId,
        toPeerId: targetPeerId,
      });
    });

    peer.on('connect', () => {
      console.log('Peer connected:', targetPeerId);
      this.peers.set(targetPeerId, peer);
    });

    peer.on('data', (data) => {
      try {
        const message = JSON.parse(data.toString());
        handleGameMessage(message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    peer.on('error', (error) => {
      console.error('Peer error:', error);
      this.peers.delete(targetPeerId);
    });

    peer.on('close', () => {
      console.log('Peer disconnected:', targetPeerId);
      this.peers.delete(targetPeerId);
    });

    // Handle incoming signal data
    signalingService.onMessage(initiator ? 'answer' : 'offer', (message) => {
      if (message.fromPeerId === targetPeerId) {
        peer.signal(message.data as any);
      }
    });
  }

  private handleIncomingConnection(peerId: string): void {
    if (this.peers.has(peerId)) return;
    this.createPeerConnection(peerId, false);
  }

  broadcast(message: GameMessage): void {
    const messageStr = JSON.stringify(message);
    this.peers.forEach((peer) => {
      if (peer.connected) {
        peer.send(messageStr);
      }
    });
  }

  sendToPeer(peerId: string, message: GameMessage): void {
    const peer = this.peers.get(peerId);
    if (peer && peer.connected) {
      peer.send(JSON.stringify(message));
    }
  }

  disconnect(): void {
    this.peers.forEach((peer) => {
      peer.destroy();
    });
    this.peers.clear();
    signalingService.disconnect();
  }

  getConnectedPeers(): string[] {
    return Array.from(this.peers.keys());
  }
}

