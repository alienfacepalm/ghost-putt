import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { canJoinInProgress, formatTime, JOIN_IN_PROGRESS_THRESHOLD } from '../game-time';

describe('game-time', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('canJoinInProgress', () => {
    it('should return true if hole started less than threshold ago', () => {
      const currentTime = 1000000;
      jest.setSystemTime(currentTime);
      
      const holeStartTime = currentTime - 10000; // 10 seconds ago
      expect(canJoinInProgress(0, holeStartTime)).toBe(true);
    });

    it('should return false if hole started more than threshold ago', () => {
      const currentTime = 1000000;
      jest.setSystemTime(currentTime);
      
      const holeStartTime = currentTime - JOIN_IN_PROGRESS_THRESHOLD - 1000; // 31 seconds ago
      expect(canJoinInProgress(0, holeStartTime)).toBe(false);
    });

    it('should return false if hole started exactly at threshold', () => {
      const currentTime = 1000000;
      jest.setSystemTime(currentTime);
      
      const holeStartTime = currentTime - JOIN_IN_PROGRESS_THRESHOLD;
      expect(canJoinInProgress(0, holeStartTime)).toBe(false);
    });

    it('should return true if hole just started', () => {
      const currentTime = 1000000;
      jest.setSystemTime(currentTime);
      
      expect(canJoinInProgress(0, currentTime)).toBe(true);
    });
  });

  describe('formatTime', () => {
    it('should format milliseconds as MM:SS', () => {
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(5000)).toBe('0:05');
      expect(formatTime(65000)).toBe('1:05');
      expect(formatTime(125000)).toBe('2:05');
    });

    it('should pad seconds with leading zero', () => {
      expect(formatTime(9000)).toBe('0:09');
      expect(formatTime(69000)).toBe('1:09');
    });

    it('should handle minutes correctly', () => {
      expect(formatTime(60000)).toBe('1:00');
      expect(formatTime(120000)).toBe('2:00');
      expect(formatTime(3665000)).toBe('61:05');
    });

    it('should handle large time values', () => {
      expect(formatTime(3600000)).toBe('60:00'); // 1 hour
    });
  });
});

