const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getQuizSessions = async (req, res) => {
  try {
    const sessions = await prisma.quiz_sessions.findMany({
      where: { is_delete: "0" },
    });
    res.status(200).json({
      message: "Lấy danh sách phiên làm bài tập thành công",
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizSession = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ message: "ID phiên làm bài tập không hợp lệ" });
    }

    const session = await prisma.quiz_sessions.findFirst({
      where: { id: parseInt(id), is_delete: "0" },
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phiên làm bài tập" });
    }

    res.status(200).json({
      message: "Lấy thông tin phiên làm bài tập thành công",
      data: session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuizSession = async (req, res) => {
  try {
    const { user_id, mode, started_at, ended_at, exam_id } = req.body;
    const session = await prisma.quiz_sessions.create({
      data: {
        user_id,
        mode,
        started_at,
        ended_at,
        exam_id,
      },
    });
    res.status(201).json({
      message: "Tạo phiên làm bài tập thành công",
      data: session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuizSession = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ message: "ID phiên làm bài tập không hợp lệ" });
    }

    const existing = await prisma.quiz_sessions.findFirst({
      where: { id: parseInt(id), is_delete: "0" },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phiên làm bài tập" });
    }

    const { user_id, mode, started_at, ended_at, exam_id } = req.body;
    const updatedSession = await prisma.quiz_sessions.update({
      where: { id: parseInt(id) },
      data: {
        user_id,
        mode,
        started_at,
        ended_at,
        exam_id,
      },
    });
    res.status(200).json({
      message: "Cập nhật thông tin phiên làm bài tập thành công",
      data: updatedSession,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateTimeEndQuizSession = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ message: "ID phiên làm bài tập không hợp lệ" });
    }

    const existing = await prisma.quiz_sessions.findFirst({
      where: { id: parseInt(id), is_delete: "0" },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phiên làm bài tập" });
    }

    const { ended_at } = req.body;
    const updatedSession = await prisma.quiz_sessions.update({
      where: { id: parseInt(id) },
      data: {
        ended_at,
      },
    });
    res.status(200).json({
      message: "Cập nhật thời gian kết phiên thành công",
      data: updatedSession,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuizSession = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ message: "ID phiên làm bài tập không hợp lệ" });
    }

    const existing = await prisma.quiz_sessions.findFirst({
      where: { id: parseInt(id), is_delete: "0" },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phiên làm bài tập" });
    }

    const deletedSession = await prisma.quiz_sessions.update({
      where: { id: parseInt(id) },
      data: { is_delete: "1" },
    });

    res.status(200).json({
      message: "Xóa phiên làm bài tập thành công",
      data: deletedSession,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
