import { describe, it, expect } from '@jest/globals';
import {
  calculateScore,
  calculateTotalScore,
  getNextPlayer,
  checkHoleComplete,
  isGameComplete,
  canPlaceObstacle,
  getPlayerColor,
} from '../game-logic';
import type { GameState, Player } from '../../../types/game.types';
import type { Course, Hole } from '../../../types/course.types';

describe('game-logic', () => {
  describe('calculateScore', () => {
    it('should return strokes as score', () => {
      expect(calculateScore(3)).toBe(3);
      expect(calculateScore(5)).toBe(5);
    });

    it('should accept par parameter but not use it', () => {
      expect(calculateScore(3, 3)).toBe(3);
      expect(calculateScore(5, 3)).toBe(5);
    });
  });

  describe('calculateTotalScore', () => {
    it('should calculate base score from all holes', () => {
      const scores = [3, 4, 5];
      const firstToHole = {};
      const playerId = 'player1';
      
      expect(calculateTotalScore(scores, firstToHole, playerId)).toBe(12);
    });

    it('should subtract bonus points for first-to-hole', () => {
      const scores = [3, 4, 5];
      const firstToHole = { 1: 'player1', 2: 'player1' };
      const playerId = 'player1';
      
      // 12 base - (2 * 2 bonus) = 8
      expect(calculateTotalScore(scores, firstToHole, playerId)).toBe(8);
    });

    it('should not subtract bonus for holes won by other players', () => {
      const scores = [3, 4, 5];
      const firstToHole = { 1: 'player2', 2: 'player3' };
      const playerId = 'player1';
      
      expect(calculateTotalScore(scores, firstToHole, playerId)).toBe(12);
    });

    it('should handle empty scores array', () => {
      const scores: number[] = [];
      const firstToHole = {};
      const playerId = 'player1';
      
      expect(calculateTotalScore(scores, firstToHole, playerId)).toBe(0);
    });
  });

  describe('getNextPlayer', () => {
    const players: Player[] = [
      { id: '1', name: 'Player1', color: '#000', isHost: true, joinedAt: 0 },
      { id: '2', name: 'Player2', color: '#111', isHost: false, joinedAt: 1 },
      { id: '3', name: 'Player3', color: '#222', isHost: false, joinedAt: 2 },
    ];

    it('should return first player if no current player', () => {
      expect(getNextPlayer(players, null)).toEqual(players[0]);
    });

    it('should return next player in sequence', () => {
      expect(getNextPlayer(players, '1')).toEqual(players[1]);
      expect(getNextPlayer(players, '2')).toEqual(players[2]);
    });

    it('should wrap around to first player', () => {
      expect(getNextPlayer(players, '3')).toEqual(players[0]);
    });

    it('should return first player if current player not found', () => {
      expect(getNextPlayer(players, '999')).toEqual(players[0]);
    });

    it('should return null if no players', () => {
      expect(getNextPlayer([], null)).toBe(null);
    });
  });

  describe('checkHoleComplete', () => {
    it('should return true when ball is close to hole', () => {
      expect(checkHoleComplete(100, 100, 110, 100, 20)).toBe(true);
      expect(checkHoleComplete(100, 100, 100, 110, 20)).toBe(true);
    });

    it('should return false when ball is far from hole', () => {
      expect(checkHoleComplete(100, 100, 200, 200, 20)).toBe(false);
    });

    it('should use default threshold of 20', () => {
      // Distance is ~14.14, which is less than 20
      expect(checkHoleComplete(100, 100, 110, 110)).toBe(true);
    });

    it('should handle exact position match', () => {
      expect(checkHoleComplete(100, 100, 100, 100, 20)).toBe(true);
    });
  });

  describe('isGameComplete', () => {
    it('should return true when currentHole exceeds totalHoles', () => {
      const state: GameState = {
        currentHole: 4,
        totalHoles: 3,
        players: [],
        scores: {},
        gameStatus: 'playing',
        currentPlayerId: null,
        ballPositions: {},
        ghostBalls: [],
        course: null,
        playerObstacles: [],
        firstToHole: {},
      };
      expect(isGameComplete(state)).toBe(true);
    });

    it('should return false when currentHole is less than or equal to totalHoles', () => {
      const state: GameState = {
        currentHole: 2,
        totalHoles: 3,
        players: [],
        scores: {},
        gameStatus: 'playing',
        currentPlayerId: null,
        ballPositions: {},
        ghostBalls: [],
        course: null,
        playerObstacles: [],
        firstToHole: {},
      };
      expect(isGameComplete(state)).toBe(false);
    });
  });

  describe('canPlaceObstacle', () => {
    const createGameState = (currentHole: number, playerObstacles: any[] = []): GameState => {
      const hole: Hole = {
        number: currentHole,
        startPosition: { x: 0, y: 0 },
        holePosition: { x: 100, y: 100 },
        obstacles: [],
        playerObstacles: playerObstacles.map(obs => ({ ...obs, id: obs.id })),
        difficulty: 1,
      };

      const course: Course = {
        id: 'test',
        generatedAt: Date.now(),
        holes: [hole],
      };

      return {
        currentHole,
        totalHoles: 3,
        players: [],
        scores: {},
        gameStatus: 'playing',
        currentPlayerId: null,
        ballPositions: {},
        ghostBalls: [],
        course,
        playerObstacles,
        firstToHole: {},
      };
    };

    it('should return true if player has not placed obstacle', () => {
      const state = createGameState(1, []);
      expect(canPlaceObstacle(state, 'player1')).toBe(true);
    });

    it('should return false if player already placed obstacle this hole', () => {
      const obstacle = {
        id: 'obs1',
        playerId: 'player1',
        type: 'wall' as const,
        position: { x: 50, y: 50 },
        width: 20,
        height: 20,
      };
      const state = createGameState(1, [obstacle]);
      expect(canPlaceObstacle(state, 'player1')).toBe(false);
    });

    it('should return true if other player placed obstacle', () => {
      const obstacle = {
        id: 'obs1',
        playerId: 'player2',
        type: 'wall' as const,
        position: { x: 50, y: 50 },
        width: 20,
        height: 20,
      };
      const state = createGameState(1, [obstacle]);
      expect(canPlaceObstacle(state, 'player1')).toBe(true);
    });

    it('should return false if course is null', () => {
      const state: GameState = {
        currentHole: 1,
        totalHoles: 3,
        players: [],
        scores: {},
        gameStatus: 'playing',
        currentPlayerId: null,
        ballPositions: {},
        ghostBalls: [],
        course: null,
        playerObstacles: [],
        firstToHole: {},
      };
      expect(canPlaceObstacle(state, 'player1')).toBe(false);
    });
  });

  describe('getPlayerColor', () => {
    it('should return color based on index', () => {
      expect(getPlayerColor('player1', 0)).toBe('#3B82F6'); // Blue
      expect(getPlayerColor('player2', 1)).toBe('#EF4444'); // Red
      expect(getPlayerColor('player3', 2)).toBe('#10B981'); // Green
    });

    it('should wrap around for indices beyond color array', () => {
      expect(getPlayerColor('player9', 8)).toBe('#3B82F6'); // Wraps to first color
      expect(getPlayerColor('player10', 9)).toBe('#EF4444'); // Wraps to second color
    });

    it('should handle negative indices', () => {
      // Modulo operation with negative numbers
      expect(getPlayerColor('player1', -1)).toBe('#F97316'); // Last color
    });
  });
});

