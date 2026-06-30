const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getExams = async (req, res) => {
  try {
    const exams = await prisma.exams.findMany({
      where: { is_delete: "0" },
    });
    res.status(200).json({
      message: "Lấy danh sách đề thi thành công",
      data: exams,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExam = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID đề thi không hợp lệ" });
    }

    const exam = await prisma.exams.findFirst({
      where: { id, is_delete: "0" },
      include: {
        exam_questions: {
          include: {
            questions: {
              include: {
                vocabularies: true,
              },
            },
          },
        },
      },
    });

    if (!exam) {
      return res.status(404).json({ message: "Không tìm thấy đề thi" });
    }

    res.status(200).json({
      message: "Lấy thông tin đề thi thành công",
      data: exam,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createExam = async (req, res) => {
  try {
    const { title, description, total_questions, time_limit_minutes } =
      req.body;
    const exam = await prisma.exams.create({
      data: {
        title,
        description,
        total_questions,
        time_limit_minutes,
      },
    });
    res.status(201).json({
      message: "Tạo đề thi thành công",
      data: exam,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID đề thi không hợp lệ" });
    }

    const exam = await prisma.exams.findFirst({
      where: { id, is_delete: "0" },
    });

    if (!exam) {
      return res.status(404).json({ message: "Không tìm thấy đề thi" });
    }

    const { title, description, total_questions, time_limit_minutes } =
      req.body;
    const updatedExam = await prisma.exams.update({
      where: { id },
      data: {
        title,
        description,
        total_questions,
        time_limit_minutes,
      },
    });

    res.status(200).json({
      message: "Cập nhật đề thi thành công",
      data: updatedExam,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID đề thi không hợp lệ" });
    }

    const exam = await prisma.exams.findFirst({
      where: { id, is_delete: "0" },
    });

    if (!exam) {
      return res.status(404).json({ message: "Không tìm thấy đề thi" });
    }

    const deletedExam = await prisma.exams.update({
      where: { id },
      data: { is_delete: "1" },
    });

    res.status(200).json({
      message: "Xóa đề thi thành công",
      data: deletedExam,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
