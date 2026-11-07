import { create } from "zustand";

interface GameState {
  hearts: number;
  maxHearts: number;
  streak: number;
  exp: number;
  activeRank: number;
  completedNodes: string[];
  activeTab: "learn" | "writing" | "video" | "exam" | "leaderboard";
  isPro: boolean;
  decrementHearts: () => void;
  refillHearts: () => void;
  addExp: (amount: number) => void;
  incrementStreak: () => void;
  completeNode: (nodeId: string) => void;
  setActiveTab: (tab: "learn" | "writing" | "video" | "exam" | "leaderboard") => void;
  setActiveRank: (rank: number) => void;
  setPro: (isPro: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  hearts: 5,
  maxHearts: 5,
  streak: 3,
  exp: 120,
  activeRank: 1,
  completedNodes: ["r1-t1-n1", "r1-t1-n2"],
  activeTab: "learn",
  isPro: false,

  decrementHearts: () =>
    set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),

  refillHearts: () => set({ hearts: 5 }),

  addExp: (amount: number) =>
    set((state) => ({ exp: state.exp + amount })),

  incrementStreak: () =>
    set((state) => ({ streak: state.streak + 1 })),

  completeNode: (nodeId: string) =>
    set((state) => ({
      completedNodes: state.completedNodes.includes(nodeId)
        ? state.completedNodes
        : [...state.completedNodes, nodeId],
      exp: state.exp + 25
    })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setActiveRank: (rank) => set({ activeRank: rank }),

  setPro: (isPro) => set({ isPro })
}));
