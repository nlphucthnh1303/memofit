import React, { useState } from "react";
import { X, Check, QrCode, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { useGameStore } from "../../stores/gameStore";

interface PaymentModalProps {
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose }) => {
  const { setPro } = useGameStore();
  const [selectedPlan, setSelectedPlan] = useState<"month" | "year" | "lifetime">("year");
  const [showQR, setShowQR] = useState(false);

  const plans = [
    {
      id: "month",
      name: "1 Tháng",
      price: "99.000 đ",
      tag: "Trải nghiệm",
      popular: false
    },
    {
      id: "year",
      name: "1 Năm (Tiết kiệm 50%)",
      price: "599.000 đ",
      tag: "Phổ biến nhất",
      popular: true
    },
    {
      id: "lifetime",
      name: "Trọn Đời (VIP)",
      price: "1.299.000 đ",
      tag: "Mua 1 lần dùng mãi mãi",
      popular: false
    }
  ] as const;

  const handleSimulatePayment = () => {
    setPro(true);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl border-2 border-slate-100 flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-6 h-6" />
        </button>

        {!showQR ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-amber-950 mb-3 shadow-md">
              <Sparkles className="w-8 h-8 fill-amber-950" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 text-center">NÂNG CẤP MEMOFIT PRO</h2>
            <p className="text-slate-500 font-bold text-xs text-center mt-1 mb-6">
              Mở khóa toàn bộ video, đề thi TOEIC không giới hạn và vô hạn Tim!
            </p>

            <div className="w-full flex flex-col gap-3 mb-6">
              {plans.map((p) => {
                const isSelected = selectedPlan === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all btn-3d ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/70 shadow-xs border-b-4"
                        : "border-slate-200 bg-white hover:bg-slate-50 border-b-4"
                    }`}
                  >
                    <div>
                      <span className="font-black text-slate-800 text-base block">{p.name}</span>
                      <span className="text-xs font-bold text-amber-600">{p.tag}</span>
                    </div>
                    <span className="font-black text-lg text-slate-900">{p.price}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowQR(true)}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-black text-base rounded-2xl border-b-4 border-amber-700 btn-3d flex items-center justify-center gap-2 shadow-md"
            >
              <QrCode className="w-5 h-5" />
              <span>THANH TOÁN QUA VIETQR (PAYOS)</span>
            </button>
          </>
        ) : (
          <div className="w-full flex flex-col items-center text-center">
            <h3 className="text-xl font-black text-slate-800 mb-1">QUÉT MÃ VIETQR THANH TOÁN</h3>
            <span className="text-xs font-bold text-slate-400 mb-4">
              Mở ứng dụng ngân hàng bất kỳ để quét mã tự động kích hoạt
            </span>

            <div className="p-4 bg-white border-2 border-slate-200 rounded-3xl shadow-md mb-4 flex flex-col items-center">
              <div className="w-48 h-48 bg-slate-100 rounded-2xl border border-slate-300 flex items-center justify-center p-2 relative">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-slate-900 rounded-xl">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        i % 3 === 0 || i % 7 === 0 ? "bg-white" : "bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="font-extrabold text-sm text-slate-700 mt-3">NGÂN HÀNG: MB BANK (PAYOS)</span>
              <span className="font-black text-xs text-emerald-600">SỐ TIỀN: 599.000 VNĐ</span>
            </div>

            <button
              onClick={handleSimulatePayment}
              className="w-full py-3.5 bg-emerald-500 text-white font-black rounded-2xl border-b-4 border-emerald-700 btn-3d flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>GIẢ LẬP THANH TOÁN THÀNH CÔNG (SANDBOX)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
