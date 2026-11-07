import React, { useState } from "react";
import { X, Heart, Volume2, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { useGameStore } from "../../stores/gameStore";

interface LessonModalProps {
  nodeId: string;
  title: string;
  onClose: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({ nodeId, title, onClose }) => {
  const { hearts, decrementHearts, completeNode } = useGameStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [clozeInput, setClozeInput] = useState("");
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const questions = [
    {
      type: "flashcard",
      word: "Colleague",
      pos: "noun",
      ipa: "/ˈkɒliːɡ/",
      meaning: "Đồng nghiệp",
      example: "I discussed the new project with my colleague.",
      exampleVi: "Tôi đã thảo luận dự án mới với đồng nghiệp của mình."
    },
    {
      type: "multiple_choice",
      question: "Chọn nghĩa tiếng Việt chính xác của từ: 'Appointment'",
      options: ["Cuộc hẹn, sự bổ nhiệm", "Đơn khiếu nại", "Hóa đơn thanh toán", "Bản kế hoạch"],
      correct: "Cuộc hẹn, sự bổ nhiệm"
    },
    {
      type: "cloze",
      question: "Điền từ thích hợp vào chỗ trống:",
      sentence: "Please confirm your ______ before arriving at the office.",
      hint: "Bắt đầu bằng chữ 'a' (cuộc hẹn)",
      correct: "appointment"
    },
    {
      type: "toeic_part5",
      question: "TOEIC Part 5: Incomplete Sentences",
      sentence: "Ms. Henderson requested that all team members submit their weekly reports ______ 5:00 PM on Friday.",
      options: ["until", "by", "during", "while"],
      correct: "by",
      explanation: "Dùng giới từ 'by' để chỉ mốc thời gian hoàn thành trước một thời điểm cụ thể."
    }
  ];

  const currentQ = questions[stepIndex];
  const progressPercent = ((stepIndex + 1) / questions.length) * 100;

  const handleCheck = () => {
    let correct = false;

    if (currentQ.type === "flashcard") {
      correct = true;
    } else if (currentQ.type === "multiple_choice" || currentQ.type === "toeic_part5") {
      correct = selectedAnswer === currentQ.correct;
    } else if (currentQ.type === "cloze") {
      correct = clozeInput.trim().toLowerCase() === (currentQ.correct?.toLowerCase() || "");
    }

    setIsCorrect(correct);
    setIsEvaluated(true);

    if (!correct) {
      decrementHearts();
    }
  };

  const handleNext = () => {
    if (stepIndex < questions.length - 1) {
      setStepIndex(stepIndex + 1);
      setSelectedAnswer(null);
      setClozeInput("");
      setIsEvaluated(false);
    } else {
      setIsFinished(true);
      completeNode(nodeId);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between max-w-2xl mx-auto w-full">
      <div className="p-4 flex items-center gap-4 border-b border-slate-100">
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 bg-slate-200 h-4 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5 text-rose-500 font-extrabold text-lg">
          <Heart className="w-6 h-6 fill-rose-500" />
          <span>{hearts}</span>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center items-center w-full">
        {isFinished ? (
          <div className="text-center flex flex-col items-center gap-4">
            <span className="text-6xl">🏆</span>
            <h2 className="text-3xl font-black text-amber-500">HOÀN THÀNH BÀI HỌC!</h2>
            <p className="text-slate-600 font-semibold max-w-sm">
              Bạn đã xuất sắc vượt qua bài học "{title}" và nhận thêm +25 EXP!
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-8 py-3.5 bg-emerald-500 text-white font-black text-lg rounded-2xl border-b-4 border-emerald-700 btn-3d"
            >
              TIẾP TỤC HÀNH TRÌNH
            </button>
          </div>
        ) : (
          <div className="w-full max-w-lg">
            {currentQ.type === "flashcard" && (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 text-center shadow-xs">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className="text-3xl font-black text-slate-800">{currentQ.word}</h3>
                  <button className="p-2 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200">
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm font-bold text-slate-400 italic">
                  {currentQ.pos} • {currentQ.ipa}
                </span>
                <div className="my-6 p-4 bg-white rounded-2xl border border-slate-200">
                  <span className="text-xl font-extrabold text-emerald-600 block">{currentQ.meaning}</span>
                </div>
                <div className="text-left bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-sm">
                  <p className="font-bold text-slate-800">{currentQ.example}</p>
                  <p className="text-slate-500 mt-1">{currentQ.exampleVi}</p>
                </div>
              </div>
            )}

            {(currentQ.type === "multiple_choice" || currentQ.type === "toeic_part5") && (
              <div className="w-full">
                <h3 className="text-xl font-black text-slate-800 mb-2">{currentQ.question}</h3>
                {currentQ.sentence && (
                  <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 mb-4 font-bold text-slate-800 text-base">
                    {currentQ.sentence}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-3">
                  {currentQ.options?.map((opt, i) => (
                    <button
                      key={i}
                      disabled={isEvaluated}
                      onClick={() => setSelectedAnswer(opt)}
                      className={`p-4 rounded-2xl border-2 text-left font-bold text-base transition-all btn-3d ${
                        selectedAnswer === opt
                          ? "border-sky-500 bg-sky-50 text-sky-700 border-b-4"
                          : "border-slate-200 bg-white text-slate-700 border-b-4 hover:bg-slate-50"
                      }`}
                    >
                      <span className="inline-block w-7 h-7 rounded-lg bg-slate-100 text-slate-500 text-xs font-black text-center leading-7 mr-3">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentQ.type === "cloze" && (
              <div className="w-full text-center">
                <h3 className="text-xl font-black text-slate-800 mb-4">{currentQ.question}</h3>
                <p className="text-lg font-bold text-slate-700 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {currentQ.sentence}
                </p>
                <input
                  type="text"
                  disabled={isEvaluated}
                  value={clozeInput}
                  onChange={(e) => setClozeInput(e.target.value)}
                  placeholder="Gõ từ vào đây..."
                  className="w-full p-4 border-2 border-slate-300 rounded-2xl font-black text-center text-xl focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-xs font-bold text-slate-400 mt-2 block">{currentQ.hint}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {!isFinished && (
        <div
          className={`p-4 border-t-2 transition-colors ${
            isEvaluated
              ? isCorrect
                ? "bg-emerald-100 border-emerald-300"
                : "bg-rose-100 border-rose-300"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="max-w-lg mx-auto flex items-center justify-between">
            {isEvaluated ? (
              <div>
                <span
                  className={`font-black text-lg block ${
                    isCorrect ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {isCorrect ? "Chính xác! Làm tốt lắm! 🎉" : "Chưa chính xác! 💔"}
                </span>
                {!isCorrect && (
                  <span className="text-xs font-bold text-rose-600">
                    Đáp án đúng: {currentQ.correct}
                  </span>
                )}
              </div>
            ) : (
              <div />
            )}

            {isEvaluated ? (
              <button
                onClick={handleNext}
                className="px-8 py-3.5 bg-emerald-500 text-white font-black rounded-2xl border-b-4 border-emerald-700 btn-3d flex items-center gap-2"
              >
                <span>TIẾP TỤC</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleCheck}
                disabled={
                  (currentQ.type === "multiple_choice" || currentQ.type === "toeic_part5") &&
                  !selectedAnswer
                }
                className="px-8 py-3.5 bg-emerald-500 disabled:bg-slate-300 text-white font-black rounded-2xl border-b-4 border-emerald-700 disabled:border-slate-400 btn-3d"
              >
                KIỂM TRA
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
