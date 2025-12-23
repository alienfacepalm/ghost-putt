import React, { useState } from 'react';
import { usePlayerStore } from '../../store/player-store';
import { useConnectionStore } from '../../store/connection-store';
import { useWebRTC } from '../../hooks/use-webrtc';
import { generateRoomCode, validateRoomCode } from '../../utils/room-code';
import { getRoomCodeFromUrl, setRoomCodeInUrl } from '../../utils/url-params';
import { savePlayerName, getPlayerName, saveRoomCode } from '../../services/storage/local-storage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { RoomCodeDisplay } from '../ui/room-code-display';

export function GameLobby() {
  const { currentPlayer, setCurrentPlayer } = usePlayerStore();
  const { roomCode, setRoomCode, isHost } = useConnectionStore();
  const { createRoom, joinRoom, isConnected } = useWebRTC(currentPlayer?.id || '');
  
  const [playerName, setPlayerName] = useState(getPlayerName() || '');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [error, setError] = useState('');

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      const newRoomCode = generateRoomCode();
      const playerId = `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const player = {
        id: playerId,
        name: playerName.trim(),
        color: '#3B82F6',
        isHost: true,
        joinedAt: Date.now(),
      };

      setCurrentPlayer(player);
      savePlayerName(playerName.trim());
      saveRoomCode(newRoomCode);
      setRoomCodeInUrl(newRoomCode);
      
      await createRoom(newRoomCode);
      setRoomCode(newRoomCode);
    } catch (err) {
      setError('Failed to create room. Please try again.');
      console.error(err);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!validateRoomCode(roomCodeInput.toUpperCase())) {
      setError('Invalid room code');
      return;
    }

    try {
      const playerId = `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const player = {
        id: playerId,
        name: playerName.trim(),
        color: '#3B82F6',
        isHost: false,
        joinedAt: Date.now(),
      };

      setCurrentPlayer(player);
      savePlayerName(playerName.trim());
      
      // In a real implementation, we'd need to get the host's peer ID
      // For now, we'll use the room code as a placeholder
      await joinRoom(roomCodeInput.toUpperCase(), roomCodeInput.toUpperCase());
      setRoomCode(roomCodeInput.toUpperCase());
      setRoomCodeInUrl(roomCodeInput.toUpperCase());
    } catch (err) {
      setError('Failed to join room. Please check the room code.');
      console.error(err);
    }
  };

  // Check for room code in URL
  React.useEffect(() => {
    const urlRoomCode = getRoomCodeFromUrl();
    if (urlRoomCode) {
      setRoomCodeInput(urlRoomCode.toUpperCase());
    }
  }, []);

  if (isConnected && roomCode) {
    return (
      <div className="max-w-md mx-auto">
        <RoomCodeDisplay roomCode={roomCode} />
        <p className="mt-4 text-center text-gray-600">
          {isHost ? 'Waiting for players to join...' : 'Connected to room!'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">GhostPutt</h2>
      
      <div className="space-y-4">
        <Input
          label="Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          maxLength={20}
        />

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Create Game</h3>
          <Button onClick={handleCreateRoom} className="w-full" variant="primary">
            Create Room
          </Button>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Join Game</h3>
          <Input
            label="Room Code"
            value={roomCodeInput}
            onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
            placeholder="Enter room code"
            maxLength={6}
            className="mb-3"
          />
          <Button onClick={handleJoinRoom} className="w-full" variant="secondary">
            Join Room
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

