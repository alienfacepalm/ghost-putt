const STORAGE_KEYS = {
  PLAYER_NAME: 'ghost-putt-player-name',
  ROOM_CODE: 'ghost-putt-room-code',
  GAME_STATE: 'ghost-putt-game-state',
} as const;

export function savePlayerName(name: string): void {
  localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name);
}

export function getPlayerName(): string | null {
  return localStorage.getItem(STORAGE_KEYS.PLAYER_NAME);
}

export function saveRoomCode(roomCode: string): void {
  localStorage.setItem(STORAGE_KEYS.ROOM_CODE, roomCode);
}

export function getRoomCode(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ROOM_CODE);
}

export function clearRoomCode(): void {
  localStorage.removeItem(STORAGE_KEYS.ROOM_CODE);
}

export function saveGameState(state: unknown): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function getGameState(): unknown | null {
  try {
    const state = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return state ? JSON.parse(state) : null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

export function clearGameState(): void {
  localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
}

