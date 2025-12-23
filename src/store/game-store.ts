import { create } from 'zustand';
import type { GameState, Player, BallPosition, GhostBall, Course, PlayerObstacle } from '../types/game.types';

interface GameStore extends GameState {
  // Actions
  setGameStatus: (status: GameState['gameStatus']) => void;
  setCurrentHole: (hole: number) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updateScore: (playerId: string, hole: number, score: number) => void;
  setCurrentPlayer: (playerId: string | null) => void;
  updateBallPosition: (playerId: string, position: BallPosition) => void;
  addGhostBall: (ghostBall: GhostBall) => void;
  removeGhostBall: (playerId: string) => void;
  updateGhostBall: (playerId: string, position: BallPosition) => void;
  setCourse: (course: Course) => void;
  addPlayerObstacle: (obstacle: PlayerObstacle) => void;
  setFirstToHole: (hole: number, playerId: string) => void;
  reset: () => void;
}

const initialState: GameState = {
  currentHole: 1,
  totalHoles: 3,
  players: [],
  scores: {},
  gameStatus: 'lobby',
  currentPlayerId: null,
  ballPositions: {},
  ghostBalls: [],
  course: null,
  playerObstacles: [],
  firstToHole: {},
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  
  setGameStatus: (status) => set({ gameStatus: status }),
  
  setCurrentHole: (hole) => set({ currentHole: hole }),
  
  addPlayer: (player) => set((state) => ({
    players: [...state.players, player],
    scores: { ...state.scores, [player.id]: [] },
  })),
  
  removePlayer: (playerId) => set((state) => {
    const newPlayers = state.players.filter(p => p.id !== playerId);
    const newScores = { ...state.scores };
    delete newScores[playerId];
    const newBallPositions = { ...state.ballPositions };
    delete newBallPositions[playerId];
    const newGhostBalls = state.ghostBalls.filter(gb => gb.playerId !== playerId);
    return {
      players: newPlayers,
      scores: newScores,
      ballPositions: newBallPositions,
      ghostBalls: newGhostBalls,
    };
  }),
  
  updateScore: (playerId, hole, score) => set((state) => {
    const playerScores = state.scores[playerId] || [];
    const newScores = [...playerScores];
    newScores[hole - 1] = score;
    return {
      scores: { ...state.scores, [playerId]: newScores },
    };
  }),
  
  setCurrentPlayer: (playerId) => set({ currentPlayerId: playerId }),
  
  updateBallPosition: (playerId, position) => set((state) => ({
    ballPositions: { ...state.ballPositions, [playerId]: position },
  })),
  
  addGhostBall: (ghostBall) => set((state) => ({
    ghostBalls: [...state.ghostBalls.filter(gb => gb.playerId !== ghostBall.playerId), ghostBall],
  })),
  
  removeGhostBall: (playerId) => set((state) => ({
    ghostBalls: state.ghostBalls.filter(gb => gb.playerId !== playerId),
  })),
  
  updateGhostBall: (playerId, position) => set((state) => ({
    ghostBalls: state.ghostBalls.map(gb => 
      gb.playerId === playerId 
        ? { ...gb, position, lastUpdate: Date.now() }
        : gb
    ),
  })),
  
  setCourse: (course) => set({ course }),
  
  addPlayerObstacle: (obstacle) => set((state) => ({
    playerObstacles: [...state.playerObstacles, obstacle],
  })),
  
  setFirstToHole: (hole, playerId) => set((state) => ({
    firstToHole: { ...state.firstToHole, [hole]: playerId },
  })),
  
  reset: () => set(initialState),
}));

