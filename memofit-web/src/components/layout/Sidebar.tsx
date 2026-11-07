import React from "react";
import { BookOpen, PenTool, Video, Award, Trophy } from "lucide-react";
import { useGameStore } from "../../stores/gameStore";

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useGameStore();

  const navItems = [
    { id: "learn", label: "HỌC BÀI", icon: BookOpen },
    { id: "writing", label: "LUYỆN VIẾT", icon: PenTool },
    { id: "video", label: "VIDEO", icon: Video },
    { id: "exam", label: "THI TOEIC", icon: Award },
    { id: "leaderboard", label: "BẢNG VÀNG", icon: Trophy }
  ] as const;

  return (
    <aside className="fixed bottom-0 sm:top-0 sm:left-0 z-30 sm:w-64 w-full bg-white sm:border-r-2 border-t-2 sm:border-t-0 border-slate-200 p-2 sm:p-4 flex sm:flex-col justify-around sm:justify-start gap-2">
      <div className="hidden sm:flex items-center gap-3 px-3 py-4 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-md">
          M
        </div>
        <div>
          <span className="font-black text-2xl text-emerald-600 tracking-tight">MEMOFIT</span>
          <span className="block text-xs font-bold text-slate-400">ENGLISH TOEIC</span>
        </div>
      </div>

      <nav className="flex sm:flex-col w-full gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl font-black text-sm tracking-wide transition-all w-full ${
                isActive
                  ? "bg-sky-100 text-sky-600 border-2 border-sky-300"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-sky-500" : "text-slate-400"}`} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
