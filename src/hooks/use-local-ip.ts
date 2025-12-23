import { useState, useEffect } from 'react';
import { getLocalIP, getServerAddress } from '../utils/get-local-ip';

export function useLocalIP() {
  const [localIP, setLocalIP] = useState<string | null>(null);
  const [serverAddress, setServerAddress] = useState<string>(getServerAddress());

  useEffect(() => {
    // Get the IP address
    getLocalIP().then((ip) => {
      if (ip) {
        setLocalIP(ip);
      }
    });

    // Update server address when location changes
    setServerAddress(getServerAddress());
  }, []);

  return { localIP, serverAddress };
}

