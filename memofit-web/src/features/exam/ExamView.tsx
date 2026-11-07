import { useState } from "react";
import { Clock, Award, ChevronRight } from "lucide-react";

export const ExamView: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState<number | null>(null);

  const exams = [
    {
      id: 1,
      title: "TOEIC Mini-Test: Part 5 Focus",
      duration: "15 phút",
      questionsCount: 20,
      targetBand: "450 - 650+",
      level: "Trung Cấp",
      difficulty: "Tiêu chuẩn"
    },
    {
      id: 2,
      title: "TOEIC Full-Test: Đề Thi Thử Tháng 11",
      duration: "120 phút",
      questionsCount: 200,
      targetBand: "650 - 990",
      level: "Nâng Cao",
      difficulty: "Độ khó thật"
    },
    {
      id: 3,
      title: "TOEIC Listening Part 1 & 2 Sprint",
      duration: "25 phút",
      questionsCount: 31,
      targetBand: "Mọi cấp độ",
      level: "Cơ Bản",
      difficulty: "Phản xạ nhanh"
    }
  ];

  return (
    <div className="max-w-xl mx-auto w-full p-4 flex flex-col items-center pb-24">
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-5 text-white shadow-md mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-5 h-5 text-yellow-300" />
          <span className="text-xs font-black tracking-wider uppercase opacity-90">PHÒNG LUYỆN ĐỀ TOEIC</span>
        </div>
        <h2 className="text-xl font-black text-white">Thi Thử Chuẩn Format Quốc Tế</h2>
      </div>

      <div className="w-full flex flex-col gap-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="p-5 bg-white border-2 border-slate-200 rounded-3xl shadow-xs hover:border-blue-400 transition-all flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-black px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg inline-block mb-1">
                  {exam.level}
                </span>
                <h3 className="font-extrabold text-slate-800 text-base">{exam.title}</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">{exam.difficulty}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 py-1">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" />
                {exam.duration}
              </span>
              <span>•</span>
              <span>{exam.questionsCount} Câu hỏi</span>
              <span>•</span>
              <span className="text-emerald-600">Mục tiêu: {exam.targetBand}</span>
            </div>

            <button
              onClick={() => setSelectedExam(exam.id)}
              className="w-full py-3 bg-blue-600 text-white font-black text-sm rounded-2xl border-b-4 border-blue-800 btn-3d flex items-center justify-center gap-1.5"
            >
              <span>{selectedExam === exam.id ? "ĐANG VÀO PHÒNG THI..." : "BẮT ĐẦU LÀM BÀI"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
