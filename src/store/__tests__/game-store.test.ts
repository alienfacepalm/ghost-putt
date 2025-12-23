import { describe, it, expect, beforeEach } from "@jest/globals";
import { useGameStore } from "../game-store";
import type { Player, Course, PlayerObstacle } from "../../types/game.types";

describe("game-store", () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.getState().reset();
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = useGameStore.getState();
      expect(state.currentHole).toBe(1);
      expect(state.totalHoles).toBe(3);
      expect(state.players).toEqual([]);
      expect(state.scores).toEqual({});
      expect(state.gameStatus).toBe("lobby");
      expect(state.currentPlayerId).toBe(null);
      expect(state.ballPositions).toEqual({});
      expect(state.ghostBalls).toEqual([]);
      expect(state.course).toBe(null);
      expect(state.playerObstacles).toEqual([]);
      expect(state.firstToHole).toEqual({});
    });
  });

  describe("setGameStatus", () => {
    it("should update game status", () => {
      useGameStore.getState().setGameStatus("playing");
      expect(useGameStore.getState().gameStatus).toBe("playing");

      useGameStore.getState().setGameStatus("finished");
      expect(useGameStore.getState().gameStatus).toBe("finished");
    });
  });

  describe("setCurrentHole", () => {
    it("should update current hole", () => {
      useGameStore.getState().setCurrentHole(2);
      expect(useGameStore.getState().currentHole).toBe(2);
    });
  });

  describe("addPlayer", () => {
    it("should add a player", () => {
      const player: Player = {
        id: "player1",
        name: "Player 1",
        color: "#000",
        isHost: true,
        joinedAt: Date.now(),
      };

      useGameStore.getState().addPlayer(player);
      const state = useGameStore.getState();

      expect(state.players).toHaveLength(1);
      expect(state.players[0]).toEqual(player);
      expect(state.scores[player.id]).toEqual([]);
    });

    it("should add multiple players", () => {
      const player1: Player = {
        id: "player1",
        name: "Player 1",
        color: "#000",
        isHost: true,
        joinedAt: Date.now(),
      };
      const player2: Player = {
        id: "player2",
        name: "Player 2",
        color: "#111",
        isHost: false,
        joinedAt: Date.now(),
      };

      useGameStore.getState().addPlayer(player1);
      useGameStore.getState().addPlayer(player2);

      const state = useGameStore.getState();
      expect(state.players).toHaveLength(2);
      expect(state.scores[player1.id]).toEqual([]);
      expect(state.scores[player2.id]).toEqual([]);
    });
  });

  describe("removePlayer", () => {
    it("should remove a player and clean up related data", () => {
      const player: Player = {
        id: "player1",
        name: "Player 1",
        color: "#000",
        isHost: true,
        joinedAt: Date.now(),
      };

      useGameStore.getState().addPlayer(player);
      useGameStore
        .getState()
        .updateBallPosition(player.id, {
          x: 100,
          y: 100,
          velocityX: 0,
          velocityY: 0,
          isMoving: false,
        });
      useGameStore.getState().addGhostBall({
        playerId: player.id,
        playerName: player.name,
        color: player.color,
        position: {
          x: 100,
          y: 100,
          velocityX: 0,
          velocityY: 0,
          isMoving: false,
        },
        lastUpdate: Date.now(),
      });

      useGameStore.getState().removePlayer(player.id);
      const state = useGameStore.getState();

      expect(state.players).toHaveLength(0);
      expect(state.scores[player.id]).toBeUndefined();
      expect(state.ballPositions[player.id]).toBeUndefined();
      expect(state.ghostBalls).toHaveLength(0);
    });
  });

  describe("updateScore", () => {
    it("should update player score for a hole", () => {
      const player: Player = {
        id: "player1",
        name: "Player 1",
        color: "#000",
        isHost: true,
        joinedAt: Date.now(),
      };

      useGameStore.getState().addPlayer(player);
      useGameStore.getState().updateScore(player.id, 1, 3);

      const state = useGameStore.getState();
      expect(state.scores[player.id]).toEqual([3]);
    });

    it("should update score for multiple holes", () => {
      const player: Player = {
        id: "player1",
        name: "Player 1",
        color: "#000",
        isHost: true,
        joinedAt: Date.now(),
      };

      useGameStore.getState().addPlayer(player);
      useGameStore.getState().updateScore(player.id, 1, 3);
      useGameStore.getState().updateScore(player.id, 2, 4);

      const state = useGameStore.getState();
      expect(state.scores[player.id]).toEqual([3, 4]);
    });
  });

  describe("setCurrentPlayer", () => {
    it("should set current player", () => {
      useGameStore.getState().setCurrentPlayer("player1");
      expect(useGameStore.getState().currentPlayerId).toBe("player1");
    });

    it("should clear current player", () => {
      useGameStore.getState().setCurrentPlayer("player1");
      useGameStore.getState().setCurrentPlayer(null);
      expect(useGameStore.getState().currentPlayerId).toBe(null);
    });
  });

  describe("updateBallPosition", () => {
    it("should update ball position", () => {
      const position = {
        x: 100,
        y: 200,
        velocityX: 1,
        velocityY: 2,
        isMoving: true,
      };
      useGameStore.getState().updateBallPosition("player1", position);

      expect(useGameStore.getState().ballPositions["player1"]).toEqual(
        position
      );
    });
  });

  describe("addGhostBall", () => {
    it("should add a ghost ball", () => {
      const ghostBall = {
        playerId: "player1",
        playerName: "Player 1",
        color: "#000",
        position: {
          x: 100,
          y: 100,
          velocityX: 0,
          velocityY: 0,
          isMoving: false,
        },
        lastUpdate: Date.now(),
      };

      useGameStore.getState().addGhostBall(ghostBall);
      const state = useGameStore.getState();

      expect(state.ghostBalls).toHaveLength(1);
      expect(state.ghostBalls[0]).toEqual(ghostBall);
    });

    it("should replace existing ghost ball for same player", () => {
      const ghostBall1 = {
        playerId: "player1",
        playerName: "Player 1",
        color: "#000",
        position: {
          x: 100,
          y: 100,
          velocityX: 0,
          velocityY: 0,
          isMoving: false,
        },
        lastUpdate: Date.now(),
      };
      const ghostBall2 = {
        playerId: "player1",
        playerName: "Player 1",
        color: "#000",
        position: {
          x: 200,
          y: 200,
          velocityX: 0,
          velocityY: 0,
          isMoving: false,
        },
        lastUpdate: Date.now() + 1000,
      };

      useGameStore.getState().addGhostBall(ghostBall1);
      useGameStore.getState().addGhostBall(ghostBall2);

      const state = useGameStore.getState();
      expect(state.ghostBalls).toHaveLength(1);
      expect(state.ghostBalls[0].position.x).toBe(200);
    });
  });

  describe("removeGhostBall", () => {
    it("should remove ghost ball", () => {
      const ghostBall = {
        playerId: "player1",
        playerName: "Player 1",
        color: "#000",
        position: {
          x: 100,
          y: 100,
          velocityX: 0,
          velocityY: 0,
          isMoving: false,
        },
        lastUpdate: Date.now(),
      };

      useGameStore.getState().addGhostBall(ghostBall);
      useGameStore.getState().removeGhostBall("player1");

      expect(useGameStore.getState().ghostBalls).toHaveLength(0);
    });
  });

  describe("updateGhostBall", () => {
    it("should update ghost ball position", async () => {
      const ghostBall = {
        playerId: "player1",
        playerName: "Player 1",
        color: "#000",
        position: {
          x: 100,
          y: 100,
          velocityX: 0,
          velocityY: 0,
          isMoving: false,
        },
        lastUpdate: Date.now(),
      };

      useGameStore.getState().addGhostBall(ghostBall);

      const newPosition = {
        x: 200,
        y: 200,
        velocityX: 1,
        velocityY: 1,
        isMoving: true,
      };
      // Add a small delay to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));
      useGameStore.getState().updateGhostBall("player1", newPosition);

      const state = useGameStore.getState();
      expect(state.ghostBalls[0].position).toEqual(newPosition);
      expect(state.ghostBalls[0].lastUpdate).toBeGreaterThanOrEqual(
        ghostBall.lastUpdate
      );
    });
  });

  describe("setCourse", () => {
    it("should set course", () => {
      const course: Course = {
        id: "course1",
        generatedAt: Date.now(),
        holes: [],
      };

      useGameStore.getState().setCourse(course);
      expect(useGameStore.getState().course).toEqual(course);
    });
  });

  describe("addPlayerObstacle", () => {
    it("should add player obstacle", () => {
      const obstacle: PlayerObstacle = {
        id: "obs1",
        type: "wall",
        position: { x: 100, y: 100 },
        width: 50,
        height: 20,
        playerId: "player1",
        playerName: "Player 1",
        placedAt: Date.now(),
      };

      useGameStore.getState().addPlayerObstacle(obstacle);
      const state = useGameStore.getState();

      expect(state.playerObstacles).toHaveLength(1);
      expect(state.playerObstacles[0]).toEqual(obstacle);
    });
  });

  describe("setFirstToHole", () => {
    it("should set first to hole winner", () => {
      useGameStore.getState().setFirstToHole(1, "player1");
      expect(useGameStore.getState().firstToHole[1]).toBe("player1");
    });

    it("should handle multiple holes", () => {
      useGameStore.getState().setFirstToHole(1, "player1");
      useGameStore.getState().setFirstToHole(2, "player2");

      const state = useGameStore.getState();
      expect(state.firstToHole[1]).toBe("player1");
      expect(state.firstToHole[2]).toBe("player2");
    });
  });

  describe("reset", () => {
    it("should reset store to initial state", () => {
      const player: Player = {
        id: "player1",
        name: "Player 1",
        color: "#000",
        isHost: true,
        joinedAt: Date.now(),
      };

      useGameStore.getState().addPlayer(player);
      useGameStore.getState().setGameStatus("playing");
      useGameStore.getState().setCurrentHole(2);

      useGameStore.getState().reset();
      const state = useGameStore.getState();

      expect(state.players).toEqual([]);
      expect(state.gameStatus).toBe("lobby");
      expect(state.currentHole).toBe(1);
    });
  });
});
