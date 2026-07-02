const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getQuizResults = async (req, res) => {
  try {
    const results = await prisma.quiz_results.findMany({
      where: { is_delete: "0" },
    });
    res.status(200).json({
      message: "Lấy danh sách kết quả bài tập thành công",
      data: results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizResult = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID kết quả không hợp lệ" });
    }

    const result = await prisma.quiz_results.findFirst({
      where: { id: parseInt(id), is_delete: "0" },
    });

    if (!result) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy kết quả bài tập" });
    }

    res.status(200).json({
      message: "Lấy thông tin kết quả bài tập thành công",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuizResult = async (req, res) => {
  try {
    const {
      session_id,
      vocabulary_id,
      question_id,
      user_answer,
      is_correct,
      response_time_ms,
    } = req.body;

    const userId = req.user.userId;

    let sm2_score = is_correct
      ? response_time_ms < 3000
        ? 5
        : response_time_ms < 8000
          ? 4
          : 3
      : 1;

    const [result] = await prisma.$transaction(async (tx) => {
      const quizResult = await tx.quiz_results.create({
        data: {
          session_id,
          vocabulary_id,
          question_id,
          user_answer,
          is_correct,
          sm2_score,
          response_time_ms,
        },
      });

      let progress = await tx.user_vocabulary_progress.findFirst({
        where: { user_id: userId, vocabulary_id: vocabulary_id },
      });

      if (!progress) {
        progress = await tx.user_vocabulary_progress.create({
          data: {
            user_id: userId,
            vocabulary_id: vocabulary_id,
            repetitions: 0,
            interval_days: 0,
            ease_factor: 2.5,
            status: "learning",
          },
        });
      }

      // Logic SM-2 (tính toán giá trị mới)
      let { repetitions, interval_days, ease_factor } = progress;

      if (sm2_score < 3) {
        repetitions = 0;
        interval_days = 1;
      } else {
        if (repetitions === 0) interval_days = 1;
        else if (repetitions === 1) interval_days = 6;
        else interval_days = Math.round(interval_days * ease_factor);

        repetitions += 1;
        ease_factor = Math.max(
          1.3,
          ease_factor +
            (0.1 - (5 - sm2_score) * (0.08 + (5 - sm2_score) * 0.02)),
        );
      }

      // Cập nhật tiến độ
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + interval_days);

      let newStatus = "learning";

      if (sm2_score < 3) {
        newStatus = "warning"; // Nếu làm sai hoặc quên thì đưa vào nhóm cần cảnh báo
      } else if (interval_days >= 30) {
        newStatus = "mastered"; // Nếu khoảng cách ôn > 30 ngày, coi như đã thuộc
      } else {
        newStatus = "learning";
      }

      await tx.user_vocabulary_progress.update({
        where: { id: progress.id },
        data: {
          repetitions,
          interval_days,
          ease_factor,
          status: newStatus,
          next_review_date: nextReviewDate,
          last_reviewed_at: new Date(),
        },
      });

      return [quizResult];
    });

    res.status(201).json({
      message: "Lưu kết quả và cập nhật tiến độ thành công",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuizResult = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID kết quả không hợp lệ" });
    }

    const existing = await prisma.quiz_results.findFirst({
      where: { id: parseInt(id), is_delete: "0" },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy kết quả bài tập" });
    }

    const {
      session_id,
      vocabulary_id,
      question_id,
      user_answer,
      is_correct,
      sm2_score,
      response_time_ms,
    } = req.body;

    const updatedResult = await prisma.quiz_results.update({
      where: { id },
      data: {
        session_id,
        vocabulary_id,
        question_id,
        user_answer,
        is_correct,
        sm2_score,
        response_time_ms,
      },
    });
    res.status(200).json({
      message: "Cập nhật kết quả bài tập thành công",
      data: updatedResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuizResult = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID kết quả không hợp lệ" });
    }

    const existing = await prisma.quiz_results.findFirst({
      where: { id: parseInt(id), is_delete: "0" },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy kết quả bài tập" });
    }

    const deletedResult = await prisma.quiz_results.update({
      where: { id: parseInt(id) },
      data: { is_delete: "1" },
    });
    res.status(200).json({
      message: "Xóa kết quả bài tập thành công",
      data: deletedResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
