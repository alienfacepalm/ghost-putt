import { create } from 'zustand';
import type { Player } from '../types/player.types';

interface PlayerStore {
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player) => void;
  clearCurrentPlayer: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  currentPlayer: null,
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  clearCurrentPlayer: () => set({ currentPlayer: null }),
}));

