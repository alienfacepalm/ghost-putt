export const JOIN_IN_PROGRESS_THRESHOLD = 30000; // 30 seconds in milliseconds

export function canJoinInProgress(gameStartTime: number, currentHoleStartTime: number): boolean {
  const timeSinceHoleStart = Date.now() - currentHoleStartTime;
  return timeSinceHoleStart < JOIN_IN_PROGRESS_THRESHOLD;
}

export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

