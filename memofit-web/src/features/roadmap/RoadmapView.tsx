import React from "react";
import { Check, Lock, Star, Trophy, Headphones, BookOpen } from "lucide-react";
import { useGameStore } from "../../stores/gameStore";

interface RoadmapViewProps {
  onStartLesson: (nodeId: string, title: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onStartLesson }) => {
  const { activeRank, setActiveRank, completedNodes } = useGameStore();

  const ranks = [
    { id: 1, name: "CƠ BẢN", sub: "Bronze (Target 0 - 450)", color: "from-amber-600 to-amber-700" },
    { id: 2, name: "TRUNG CẤP", sub: "Silver (Target 450 - 650)", color: "from-slate-400 to-slate-500" },
    { id: 3, name: "NÂNG CAO", sub: "Gold (Target 650 - 800)", color: "from-yellow-400 to-yellow-500" },
    { id: 4, name: "CAO THỦ", sub: "Diamond (Target 800 - 900)", color: "from-cyan-400 to-blue-500" },
    { id: 5, name: "THÁCH ĐẤU", sub: "Legend (TOEIC 900+ Master)", color: "from-purple-500 to-indigo-600" }
  ];

  const topics = [
    {
      id: "t1",
      title: "Chủ Đề 1: Gặp Gỡ & Chào Hỏi Nơi Công Sở",
      nodes: [
        { id: "r1-t1-n1", label: "Từ vựng mở đầu", icon: Star, offset: 0 },
        { id: "r1-t1-n2", label: "Phản xạ nghe", icon: Headphones, offset: 40 },
        { id: "r1-t1-n3", label: "Ghép câu giao tiếp", icon: BookOpen, offset: -40 },
        { id: "r1-t1-n4", label: "Thử Thách Vượt Ải", icon: Trophy, offset: 0, isBoss: true }
      ]
    },
    {
      id: "t2",
      title: "Chủ Đề 2: Đặt Lịch Hẹn & Email Khách Hàng",
      nodes: [
        { id: "r1-t2-n1", label: "Thuật ngữ đặt lịch", icon: Star, offset: 0 },
        { id: "r1-t2-n2", label: "Luyện nghe giờ hẹn", icon: Headphones, offset: -45 },
        { id: "r1-t2-n3", label: "Điền mẫu email", icon: BookOpen, offset: 35 },
        { id: "r1-t2-n4", label: "Kiểm Tra Trùm Cuối", icon: Trophy, offset: 0, isBoss: true }
      ]
    }
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto pb-24">
      <div className="flex gap-2 overflow-x-auto w-full p-2 mb-6 scrollbar-none">
        {ranks.map((rank) => (
          <button
            key={rank.id}
            onClick={() => setActiveRank(rank.id)}
            className={`flex-1 min-w-[140px] px-3 py-2 rounded-2xl text-left border-2 transition-all ${
              activeRank === rank.id
                ? "border-emerald-500 bg-emerald-50 shadow-sm"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <span className="block font-black text-xs text-slate-500">RANK {rank.id}</span>
            <span className="block font-extrabold text-sm text-slate-800">{rank.name}</span>
            <span className="block text-[11px] font-semibold text-slate-400 truncate">{rank.sub}</span>
          </button>
        ))}
      </div>

      {topics.map((topic) => (
        <div key={topic.id} className="w-full mb-10 flex flex-col items-center">
          <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-5 text-white shadow-md mb-8">
            <span className="text-xs font-black tracking-wider uppercase opacity-90">BÀI HỌC TRỌNG TÂM</span>
            <h2 className="text-lg font-black mt-1 text-white">{topic.title}</h2>
          </div>

          <div className="relative flex flex-col items-center gap-7 w-full">
            {topic.nodes.map((node) => {
              const Icon = node.icon;
              const isCompleted = completedNodes.includes(node.id);
              const isCurrent = !isCompleted && completedNodes.length === 2 && node.id === "r1-t1-n3";
              const isLocked = !isCompleted && !isCurrent;

              return (
                <div
                  key={node.id}
                  style={{ transform: `translateX(${node.offset}px)` }}
                  className="flex flex-col items-center relative transition-transform"
                >
                  <button
                    disabled={isLocked}
                    onClick={() => onStartLesson(node.id, node.label)}
                    className={`w-20 h-20 rounded-full flex items-center justify-center relative btn-3d transition-all ${
                      node.isBoss
                        ? isCompleted
                          ? "bg-amber-400 border-b-8 border-amber-600 text-white"
                          : isCurrent
                          ? "bg-yellow-400 border-b-8 border-yellow-600 text-amber-950 animate-pulse ring-4 ring-yellow-200"
                          : "bg-slate-200 border-b-8 border-slate-300 text-slate-400"
                        : isCompleted
                        ? "bg-emerald-500 border-b-8 border-emerald-700 text-white"
                        : isCurrent
                        ? "bg-emerald-400 border-b-8 border-emerald-600 text-white animate-bounce ring-4 ring-emerald-200"
                        : "bg-slate-200 border-b-8 border-slate-300 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-9 h-9 stroke-[3]" />
                    ) : isLocked ? (
                      <Lock className="w-7 h-7" />
                    ) : (
                      <Icon className="w-9 h-9" />
                    )}
                  </button>

                  <span className="mt-2 text-xs font-extrabold text-slate-700 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                    {node.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
