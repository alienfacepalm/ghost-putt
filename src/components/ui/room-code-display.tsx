import React, { useState } from 'react';
import { formatRoomCode } from '../../utils/room-code';
import { getShareableLink } from '../../utils/url-params';
import { useLocalIP } from '../../hooks/use-local-ip';

interface RoomCodeDisplayProps {
  roomCode: string;
}

export function RoomCodeDisplay({ roomCode }: RoomCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const { localIP, serverAddress } = useLocalIP();

  const handleCopy = async () => {
    const link = getShareableLink(roomCode);
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleCopyIP = async () => {
    const address = localIP ? `http://${localIP}:${window.location.port || '3000'}` : `http://${serverAddress}`;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const displayAddress = localIP ? `http://${localIP}:${window.location.port || '3000'}` : `http://${serverAddress}`;

  return (
    <div className="bg-white rounded-lg p-4 shadow-md space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">Room Code</p>
        <div className="flex items-center gap-2">
          <code className="text-2xl font-mono font-bold text-primary-600">
            {formatRoomCode(roomCode)}
          </code>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-2">Server Address</p>
        <div className="flex items-center gap-2">
          <code className="text-base font-mono text-gray-800 break-all">
            {displayAddress}
          </code>
          <button
            onClick={handleCopyIP}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            Copy IP
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Share this address with players on your network
        </p>
      </div>
    </div>
  );
}

