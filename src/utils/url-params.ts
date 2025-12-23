export function getRoomCodeFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('room') || null;
}

export function setRoomCodeInUrl(roomCode: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set('room', roomCode);
  window.history.pushState({}, '', url.toString());
}

export function getShareableLink(roomCode: string): string {
  const url = new URL(window.location.href);
  url.searchParams.set('room', roomCode);
  return url.toString();
}

