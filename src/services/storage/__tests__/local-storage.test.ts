import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  savePlayerName,
  getPlayerName,
  saveRoomCode,
  getRoomCode,
  clearRoomCode,
  saveGameState,
  getGameState,
  clearGameState,
} from '../local-storage';

describe('local-storage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('player name', () => {
    it('should save and retrieve player name', () => {
      savePlayerName('TestPlayer');
      expect(getPlayerName()).toBe('TestPlayer');
    });

    it('should return null if player name not set', () => {
      expect(getPlayerName()).toBe(null);
    });

    it('should overwrite existing player name', () => {
      savePlayerName('Player1');
      savePlayerName('Player2');
      expect(getPlayerName()).toBe('Player2');
    });
  });

  describe('room code', () => {
    it('should save and retrieve room code', () => {
      saveRoomCode('ABCDEF');
      expect(getRoomCode()).toBe('ABCDEF');
    });

    it('should return null if room code not set', () => {
      expect(getRoomCode()).toBe(null);
    });

    it('should clear room code', () => {
      saveRoomCode('ABCDEF');
      clearRoomCode();
      expect(getRoomCode()).toBe(null);
    });
  });

  describe('game state', () => {
    it('should save and retrieve game state', () => {
      const gameState = { currentHole: 1, players: [] };
      saveGameState(gameState);
      expect(getGameState()).toEqual(gameState);
    });

    it('should return null if game state not set', () => {
      expect(getGameState()).toBe(null);
    });

    it('should handle complex game state objects', () => {
      const gameState = {
        currentHole: 2,
        players: [{ id: '1', name: 'Player1' }],
        scores: { '1': [3, 4] },
      };
      saveGameState(gameState);
      expect(getGameState()).toEqual(gameState);
    });

    it('should clear game state', () => {
      saveGameState({ currentHole: 1 });
      clearGameState();
      expect(getGameState()).toBe(null);
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock localStorage.setItem to throw an error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      saveGameState({ test: 'data' });
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Restore
      Storage.prototype.setItem = originalSetItem;
      consoleErrorSpy.mockRestore();
    });

    it('should handle invalid JSON gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Manually set invalid JSON
      localStorage.setItem('ghost-putt-game-state', 'invalid json{');

      const result = getGameState();
      expect(result).toBe(null);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});

