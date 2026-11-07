export interface FrontEndQuizResult {
    isCorrect: boolean;
    sm2Score: number;
}

/**
 * Tính toán nhanh kết quả Đúng/Sai và quy đổi điểm SM-2 dự kiến trên Front-end
 * @param userAnswer Đáp án người dùng chọn
 * @param correctAnswer Đáp án đúng của câu hỏi
 * @param responseTimeMs Thời gian phản hồi (mili-giây)
 */
export function calculateInstantQuizResult(
    userAnswer: string,
    correctAnswer: string,
    responseTimeMs: number
): FrontEndQuizResult {
    // 1. Kiểm tra Đúng/Sai lập tức
    const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

    let sm2Score = 4;

    if (!isCorrect) {
        sm2Score = responseTimeMs > 15000 ? 0 : 2; // Sai do quá lâu (>15s) -> 0, sai do chọn nhầm -> 2
    } else {
        if (responseTimeMs <= 2500) {
            sm2Score = 5; // Phản xạ tối (< 2.5 giây)
        } else if (responseTimeMs > 20000) {
            sm2Score = 3; // Nhớ khó khăn (> 20 giây)
        }
    }

    return { isCorrect, sm2Score };
}