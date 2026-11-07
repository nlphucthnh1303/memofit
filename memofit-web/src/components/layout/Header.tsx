import React from "react";
import { Flame, Heart, Zap, Crown } from "lucide-react";
import { useGameStore } from "../../stores/gameStore";

interface HeaderProps {
  onOpenPayment: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPayment }) => {
  const { hearts, streak, exp, isPro } = useGameStore();

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 px-4 py-3 flex items-center justify-between max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
          <span className="text-xl">🇺🇸</span>
          <span className="text-sm font-bold text-slate-700 uppercase">EN - VI</span>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-1.5 text-orange-500 font-extrabold text-base">
          <Flame className="w-6 h-6 fill-orange-500 animate-bounce" />
          <span>{streak}</span>
        </div>

        <div className="flex items-center gap-1.5 text-yellow-500 font-extrabold text-base">
          <Zap className="w-6 h-6 fill-yellow-500" />
          <span>{exp}</span>
        </div>

        <div className="flex items-center gap-1.5 text-rose-500 font-extrabold text-base">
          <Heart className="w-6 h-6 fill-rose-500" />
          <span>{hearts}</span>
        </div>

        <button
          onClick={onOpenPayment}
          className={`px-3 py-1.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 transition-all btn-3d ${
            isPro
              ? "bg-amber-400 text-amber-950 border-b-4 border-amber-600"
              : "bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 border-b-4 border-amber-600 hover:brightness-105"
          }`}
        >
          <Crown className="w-4 h-4 fill-amber-950" />
          <span className="hidden sm:inline">{isPro ? "PRO VIP" : "NÂNG CẤP PRO"}</span>
        </button>
      </div>
    </header>
  );
};
