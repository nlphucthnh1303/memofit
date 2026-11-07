import { useState } from "react";
import { Play, Pause, Mic, MicOff, Sparkles } from "lucide-react";

export const VideoView: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [dictationInput, setDictationInput] = useState("");
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [mode, setMode] = useState<"dictation" | "shadowing">("dictation");
  const [isRecording, setIsRecording] = useState(false);
  const [speechScore, setSpeechScore] = useState<number | null>(null);

  const currentSentence = "Good morning everyone, welcome to our annual marketing meeting.";
  const currentSentenceVi = "Chào buổi sáng mọi người, chào mừng đến với cuộc họp tiếp thị thường niên của chúng ta.";

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCheckDictation = () => {
    setIsEvaluated(true);
  };

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setSpeechScore(88);
      }, 3000);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full p-4 flex flex-col items-center pb-24">
      <div className="flex gap-2 w-full mb-4">
        <button
          onClick={() => {
            setMode("dictation");
            setIsEvaluated(false);
          }}
          className={`flex-1 py-2.5 rounded-2xl font-black text-sm border-2 transition-all ${
            mode === "dictation"
              ? "bg-sky-50 border-sky-400 text-sky-600 shadow-xs"
              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          1. CHÉP CHÍNH TẢ (DICTATION)
        </button>
        <button
          onClick={() => {
            setMode("shadowing");
            setSpeechScore(null);
          }}
          className={`flex-1 py-2.5 rounded-2xl font-black text-sm border-2 transition-all ${
            mode === "shadowing"
              ? "bg-purple-50 border-purple-400 text-purple-600 shadow-xs"
              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          2. NHẠI GIỌNG (SHADOWING)
        </button>
      </div>

      <div className="w-full bg-slate-900 rounded-3xl overflow-hidden aspect-video relative flex flex-col items-center justify-center p-6 text-center shadow-lg mb-6">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <button
            onClick={handleTogglePlay}
            className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-md btn-3d"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-slate-900" /> : <Play className="w-8 h-8 fill-slate-900 ml-1" />}
          </button>
          <span className="text-white/80 text-xs font-bold tracking-wider">HỘI THOẠI DOANH NGHIỆP • 0:15 / 0:45</span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-center z-10">
          <p className="text-white font-extrabold text-base drop-shadow-md">
            {mode === "shadowing" ? currentSentence : "••••••••••••••••••••••••••••••••••••••••"}
          </p>
          <span className="text-white/60 text-xs font-semibold">{currentSentenceVi}</span>
        </div>
      </div>

      {mode === "dictation" ? (
        <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-3xl p-6">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wide block mb-3">
            Nghe video và gõ lại nội dung từng câu:
          </span>
          <textarea
            value={dictationInput}
            onChange={(e) => setDictationInput(e.target.value)}
            placeholder="Nhập những gì bạn nghe được..."
            rows={3}
            className="w-full p-4 border-2 border-slate-300 rounded-2xl font-bold text-slate-800 text-base focus:border-sky-500 focus:outline-none bg-white mb-4"
          />

          {isEvaluated ? (
            <div className="flex flex-col gap-3">
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-800 text-sm">
                <span className="font-extrabold block mb-1">Đối chiếu đáp án chuẩn:</span>
                <p className="font-bold">{currentSentence}</p>
              </div>
              <button
                onClick={() => {
                  setDictationInput("");
                  setIsEvaluated(false);
                }}
                className="w-full py-3.5 bg-sky-500 text-white font-black rounded-2xl border-b-4 border-sky-700 btn-3d"
              >
                CÂU TIẾP THEO
              </button>
            </div>
          ) : (
            <button
              onClick={handleCheckDictation}
              disabled={!dictationInput.trim()}
              className="w-full py-3.5 bg-sky-500 disabled:bg-slate-300 text-white font-black rounded-2xl border-b-4 border-sky-700 disabled:border-slate-400 btn-3d"
            >
              KIỂM TRA CHÍNH TẢ
            </button>
          )}
        </div>
      ) : (
        <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 text-center flex flex-col items-center">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wide block mb-4">
            Lắng nghe câu mẫu và bấm Mic nhại giọng (Shadowing):
          </span>

          <button
            onClick={handleToggleRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white border-b-4 btn-3d transition-all mb-4 ${
              isRecording
                ? "bg-rose-500 border-rose-700 animate-pulse ring-8 ring-rose-200"
                : "bg-purple-600 border-purple-800 hover:brightness-105"
            }`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>

          <span className="text-sm font-extrabold text-slate-700">
            {isRecording ? "Đang lắng nghe... Hãy nói ngay!" : "Chạm để thu âm phát âm của bạn"}
          </span>

          {speechScore !== null && (
            <div className="mt-6 p-5 bg-white border-2 border-purple-200 rounded-2xl w-full flex items-center justify-around shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                <span className="font-black text-slate-800 text-lg">Độ chuẩn xác:</span>
              </div>
              <span className="text-2xl font-black text-purple-600">{speechScore}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
