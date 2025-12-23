/**
 * Gets the local IP address for sharing with other devices on the network.
 * Uses WebRTC to discover the local IP address.
 */
export function getLocalIP(): Promise<string | null> {
  return new Promise((resolve) => {
    // Try to get IP from WebRTC
    const RTCPeerConnection =
      window.RTCPeerConnection ||
      (window as any).webkitRTCPeerConnection ||
      (window as any).mozRTCPeerConnection;

    if (!RTCPeerConnection) {
      // Fallback: use hostname from URL
      const hostname = window.location.hostname;
      resolve(hostname === 'localhost' ? null : hostname);
      return;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.createDataChannel('');

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = event.candidate.candidate;
        const match = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
        if (match) {
          const ip = match[1];
          // Filter out localhost and invalid IPs
          if (ip && ip !== '127.0.0.1' && !ip.startsWith('169.254')) {
            pc.close();
            resolve(ip);
            return;
          }
        }
      }
    };

    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch(() => {
        // Fallback: use hostname from URL
        const hostname = window.location.hostname;
        resolve(hostname === 'localhost' ? null : hostname);
      });

    // Timeout after 2 seconds
    setTimeout(() => {
      pc.close();
      // Fallback: use hostname from URL
      const hostname = window.location.hostname;
      resolve(hostname === 'localhost' ? null : hostname);
    }, 2000);
  });
}

/**
 * Gets the current server address (hostname:port) for sharing
 */
export function getServerAddress(): string {
  const hostname = window.location.hostname;
  const port = window.location.port || '3000';
  
  // If accessed via localhost, try to get the actual IP
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `localhost:${port}`;
  }
  
  return `${hostname}:${port}`;
}

