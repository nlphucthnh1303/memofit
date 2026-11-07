import { useState } from "react";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { RoadmapView } from "./features/roadmap/RoadmapView";
import { WritingView } from "./features/writing/WritingView";
import { VideoView } from "./features/video/VideoView";
import { ExamView } from "./features/exam/ExamView";
import { LessonModal } from "./features/lesson/LessonModal";
import { PaymentModal } from "./features/payment/PaymentModal";
import { useGameStore } from "./stores/gameStore";

export function App() {
  const { activeTab } = useGameStore();
  const [activeLesson, setActiveLesson] = useState<{ id: string; title: string } | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col sm:pl-64">
      <Sidebar />
      <Header onOpenPayment={() => setIsPaymentOpen(true)} />

      <main className="flex-1 p-4 sm:p-6 w-full max-w-4xl mx-auto flex flex-col items-center">
        {activeTab === "learn" && (
          <RoadmapView
            onStartLesson={(id, title) => setActiveLesson({ id, title })}
          />
        )}
        {activeTab === "writing" && <WritingView />}
        {activeTab === "video" && <VideoView />}
        {activeTab === "exam" && <ExamView />}
        {activeTab === "leaderboard" && (
          <div className="p-8 text-center max-w-md mx-auto">
            <span className="text-5xl block mb-2">🏆</span>
            <h2 className="text-2xl font-black text-slate-800">BẢNG VÀNG CAO THỦ</h2>
            <p className="text-slate-500 font-bold text-sm mt-1">
              Top 30 học viên có chuỗi ngày học liên tục và điểm EXP cao nhất tuần.
            </p>
          </div>
        )}
      </main>

      {activeLesson && (
        <LessonModal
          nodeId={activeLesson.id}
          title={activeLesson.title}
          onClose={() => setActiveLesson(null)}
        />
      )}

      {isPaymentOpen && (
        <PaymentModal onClose={() => setIsPaymentOpen(false)} />
      )}
    </div>
  );
}

export default App;
