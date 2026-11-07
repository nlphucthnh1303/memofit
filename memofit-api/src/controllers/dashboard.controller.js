const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy từ authcheck middleware
    const now = new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    // ----------------------------------------------------------------
    // 1.1. Thống kê tổng số từ vựng đã học (Có trong bảng tiến độ)
    // 1.5. Số từ vựng cần ôn tập trong ngày (next_review_date <= hiện tại)
    // ----------------------------------------------------------------
    const totalLearnedVocab = await prisma.user_vocabulary_progress.count({
      where: {
        user_id: userId,
        is_delete: "0",
      },
    });

    const todayLearnedVocab = await prisma.user_vocabulary_progress.count({
      where: {
        user_id: userId,
        is_delete: "0",
        last_reviewed_at: {
          gte: startOfToday, // Lớn hơn hoặc bằng 00:00:00 hôm nay
        },
      },
    });

    const wordsToReviewToday = await prisma.user_vocabulary_progress.count({
      where: {
        user_id: userId,
        is_delete: "0",
        next_review_date: {
          lte: now,
        },
      },
    });

    // ----------------------------------------------------------------
    // 1.2. Thống kê tổng số câu hỏi đã hoàn thành
    // 1.3. Tính toán tỷ lệ trả lời đúng (Accuracy %)
    // 1.6. Số liệu biểu đồ so sánh đúng/sai
    // ----------------------------------------------------------------
    const totalQuestions = await prisma.quiz_results.count({
      where: {
        quiz_sessions: {
          user_id: userId,
        },
        is_delete: "0",
      },
    });

    const totalCorrect = await prisma.quiz_results.count({
      where: {
        quiz_sessions: {
          user_id: userId,
        },
        is_correct: true,
        is_delete: "0",
      },
    });

    const totalIncorrect = totalQuestions - totalCorrect;
    const accuracy =
      totalQuestions > 0
        ? parseFloat(((totalCorrect / totalQuestions) * 100).toFixed(2))
        : 0;

    // ----------------------------------------------------------------
    // 1.4. Theo dõi chuỗi ngày học liên tiếp (Streak)
    // ----------------------------------------------------------------
    const userStreak = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        current_streak: true,
        longest_streak: true,
      },
    });

    // ----------------------------------------------------------------
    // 1.7. Biểu đồ báo cáo tiến độ học tập theo ngày (7 ngày gần nhất)
    // ----------------------------------------------------------------
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentQuizResults = await prisma.quiz_results.findMany({
      where: {
        quiz_sessions: {
          user_id: userId,
        },
        created_at: {
          gte: sevenDaysAgo,
        },
        is_delete: "0",
      },
      select: {
        created_at: true,
        is_correct: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    // Xử lý gom nhóm dữ liệu theo ngày bằng JavaScript để trả về mảng đồ thị chuẩn
    const dailyProgressMap = {};
    // Khởi tạo sẵn 7 ngày gần nhất với giá trị = 0 để tránh bị khuyết ngày trên biểu đồ
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
      dailyProgressMap[dateString] = {
        date: dateString,
        questionsAnswered: 0,
        correctAnswers: 0,
      };
    }

    // Đổ dữ liệu DB vào map ngày
    recentQuizResults.forEach((result) => {
      if (result.created_at) {
        const dateString = new Date(result.created_at).toLocaleDateString(
          "vi-VN",
          { day: "2-digit", month: "2-digit" },
        );
        if (dailyProgressMap[dateString]) {
          dailyProgressMap[dateString].questionsAnswered += 1;
          if (result.is_correct) {
            dailyProgressMap[dateString].correctAnswers += 1;
          }
        }
      }
    });

    const dailyProgressChart = Object.values(dailyProgressMap);

    // ----------------------------------------------------------------
    // 1.8. Sức khỏe Từ vựng - Thống kê theo trạng thái SM-2
    // ----------------------------------------------------------------
    const vocabHealthRaw = await prisma.user_vocabulary_progress.groupBy({
      by: ["status"],
      where: {
        user_id: userId,
        is_delete: "0",
      },
      _count: {
        status: true,
      },
    });

    const vocabHealthMap = { learning: 0, mastered: 0, warning: 0, expired: 0 };
    vocabHealthRaw.forEach((item) => {
      if (item.status && vocabHealthMap.hasOwnProperty(item.status)) {
        vocabHealthMap[item.status] = item._count.status;
      }
    });
    const vocabHealthTotal = Object.values(vocabHealthMap).reduce((a, b) => a + b, 0);
    const vocabularyHealth = {
      learning: vocabHealthMap.learning,
      mastered: vocabHealthMap.mastered,
      warning: vocabHealthMap.warning,
      expired: vocabHealthMap.expired,
      total: vocabHealthTotal,
      learningPercent: vocabHealthTotal > 0 ? parseFloat(((vocabHealthMap.learning / vocabHealthTotal) * 100).toFixed(1)) : 0,
      masteredPercent: vocabHealthTotal > 0 ? parseFloat(((vocabHealthMap.mastered / vocabHealthTotal) * 100).toFixed(1)) : 0,
      warningPercent: vocabHealthTotal > 0 ? parseFloat(((vocabHealthMap.warning / vocabHealthTotal) * 100).toFixed(1)) : 0,
      expiredPercent: vocabHealthTotal > 0 ? parseFloat(((vocabHealthMap.expired / vocabHealthTotal) * 100).toFixed(1)) : 0,
    };

    // ----------------------------------------------------------------
    // 1.9. Biểu đồ Đúng / Sai theo ngày (7 ngày gần nhất)
    // ----------------------------------------------------------------
    const dailyCorrectIncorrect = Object.values(dailyProgressMap).map((day) => ({
      date: day.date,
      correct: day.correctAnswers,
      incorrect: day.questionsAnswered - day.correctAnswers,
    }));

    // ----------------------------------------------------------------
    // 2.0. Bảng "Đã học gần đây" - 5 từ vựng ôn tập gần nhất
    // ----------------------------------------------------------------
    const recentlyReviewedRaw = await prisma.user_vocabulary_progress.findMany({
      where: {
        user_id: userId,
        is_delete: "0",
        last_reviewed_at: { not: null },
      },
      orderBy: {
        last_reviewed_at: "desc",
      },
      take: 5,
      select: {
        id: true,
        status: true,
        repetitions: true,
        ease_factor: true,
        next_review_date: true,
        last_reviewed_at: true,
        vocabularies: {
          select: {
            id: true,
            word: true,
            meaning: true,
          },
        },
      },
    });

    const recentlyReviewed = recentlyReviewedRaw.map((item) => ({
      id: item.id,
      vocabularyId: item.vocabularies?.id || null,
      word: item.vocabularies?.word || "",
      meaning: item.vocabularies?.meaning || "",
      status: item.status,
      repetitions: item.repetitions || 0,
      easeFactor: item.ease_factor || 2.5,
      nextReviewDate: item.next_review_date,
      lastReviewedAt: item.last_reviewed_at,
    }));

    // ----------------------------------------------------------------
    // ĐÓNG GÓI TOÀN BỘ DỮ LIỆU ĐỂ TRẢ VỀ CHO DASHBOARD
    // ----------------------------------------------------------------
    return res.status(200).json({
      success: true,
      stats: {
        totalLearnedVocab, // 1.1
        totalQuestionsCompleted: totalQuestions, // 1.2
        accuracyPercentage: accuracy, // 1.3
        currentStreak: userStreak?.current_streak || 0, // 1.4
        longestStreak: userStreak?.longest_streak || 0, // 1.4
        todayLearnedVocab,
        wordsToReviewToday, // 1.5
      },
      charts: {
        compareCorrectIncorrect: {
          // 1.6 (Biểu đồ tròn Đúng / Sai)
          correct: totalCorrect,
          incorrect: totalIncorrect,
        },
        dailyProgressChart, // 1.7 (Biểu đồ cột/đường Tiến độ 7 ngày)
        vocabularyHealth, // 1.8 (Biểu đồ donut Sức khỏe Từ vựng)
        dailyCorrectIncorrect, // 1.9 (Biểu đồ cột Đúng/Sai 7 ngày)
      },
      recentlyReviewed, // 2.0 (Bảng Đã học gần đây)
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi hệ thống khi tải dữ liệu tổng quan.",
    });
  }
};
