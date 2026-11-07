import React, { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

export const WritingView: React.FC = () => {
  const writingExercises = [
    {
      id: "w1",
      topic: "Thì Hiện Tại Hoàn Thành (Present Perfect)",
      prompt: "Sắp xếp các từ để tạo thành câu hoàn chỉnh:",
      vietnamese: "Họ đã làm việc tại công ty này được 5 năm.",
      availableWords: ["worked", "for", "They", "at", "five", "have", "company", "this", "years."],
      correctSentence: "They have worked at this company for five years."
    },
    {
      id: "w2",
      topic: "Câu Bị Động Thương Mại (Passive Voice)",
      prompt: "Sắp xếp câu bị động đúng ngữ pháp:",
      vietnamese: "Bản hợp đồng đã được ký bởi cả hai giám đốc.",
      availableWords: ["The", "signed", "was", "both", "by", "directors.", "contract"],
      correctSentence: "The contract was signed by both directors."
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const currentEx = writingExercises[currentIdx];
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>(currentEx.availableWords);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectWord = (word: string, index: number) => {
    setSelectedWords([...selectedWords, word]);
    const updated = [...available];
    updated.splice(index, 1);
    setAvailable(updated);
  };

  const handleRemoveWord = (word: string, index: number) => {
    setAvailable([...available, word]);
    const updated = [...selectedWords];
    updated.splice(index, 1);
    setSelectedWords(updated);
  };

  const handleReset = () => {
    setSelectedWords([]);
    setAvailable(currentEx.availableWords);
    setIsEvaluated(false);
  };

  const handleCheck = () => {
    const userSentence = selectedWords.join(" ");
    const correct = userSentence === currentEx.correctSentence;
    setIsCorrect(correct);
    setIsEvaluated(true);
  };

  const handleNext = () => {
    if (currentIdx < writingExercises.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setSelectedWords([]);
      setAvailable(writingExercises[nextIdx].availableWords);
      setIsEvaluated(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full p-4 flex flex-col items-center pb-24">
      <div className="w-full bg-indigo-500 rounded-3xl p-5 text-white shadow-md mb-6">
        <span className="text-xs font-black tracking-wider uppercase opacity-90">LUYỆN VIẾT NGỮ PHÁP</span>
        <h2 className="text-xl font-black mt-1 text-white">{currentEx.topic}</h2>
      </div>

      <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 mb-6">
        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wide block mb-1">
          {currentEx.prompt}
        </span>
        <p className="text-lg font-black text-slate-800 mb-6">{currentEx.vietnamese}</p>

        <div className="min-h-[70px] p-3 border-b-2 border-dashed border-slate-300 flex flex-wrap gap-2 items-center mb-6">
          {selectedWords.map((word, index) => (
            <button
              key={index}
              onClick={() => handleRemoveWord(word, index)}
              className="px-4 py-2 bg-white border-2 border-slate-300 rounded-xl font-extrabold text-slate-700 shadow-xs hover:border-rose-400"
            >
              {word}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {available.map((word, index) => (
            <button
              key={index}
              onClick={() => handleSelectWord(word, index)}
              className="px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl font-extrabold text-slate-700 border-b-4 hover:bg-slate-100 btn-3d"
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {isEvaluated ? (
        <div className="w-full flex flex-col gap-3">
          <div
            className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${
              isCorrect ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-rose-50 border-rose-300 text-rose-800"
            }`}
          >
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <span className="font-extrabold text-sm block">
                {isCorrect ? "Cấu trúc câu hoàn toàn chính xác! 🌟" : "Chưa chính xác!"}
              </span>
              {!isCorrect && (
                <span className="text-xs font-semibold mt-0.5 block">
                  Đáp án chuẩn: {currentEx.correctSentence}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3.5 bg-emerald-500 text-white font-black rounded-2xl border-b-4 border-emerald-700 btn-3d"
          >
            BÀI TIẾP THEO
          </button>
        </div>
      ) : (
        <div className="w-full flex gap-3">
          <button
            onClick={handleReset}
            className="p-3.5 border-2 border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-100 btn-3d"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <button
            onClick={handleCheck}
            disabled={selectedWords.length === 0}
            className="flex-1 py-3.5 bg-indigo-500 disabled:bg-slate-300 text-white font-black rounded-2xl border-b-4 border-indigo-700 disabled:border-slate-400 btn-3d"
          >
            KIỂM TRA CÂU
          </button>
        </div>
      )}
    </div>
  );
};
