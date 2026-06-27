const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getExamQuestions = async (req, res) => {
  try {
    const items = await prisma.exam_questions.findMany({
      where: { is_delete: "0" },
    });
    res.status(200).json({
      message: "Lấy danh sách câu hỏi trong đề thi thành công",
      data: items,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExamQuestion = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const item = await prisma.exam_questions.findFirst({
      where: { id, is_delete: "0" },
    });

    if (!item) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy câu hỏi trong đề thi" });
    }

    res.status(200).json({
      message: "Lấy thông tin câu hỏi trong đề thi thành công",
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createExamQuestion = async (req, res) => {
  try {
    const { exam_id, question_id } = req.body;
    const item = await prisma.exam_questions.create({
      data: {
        exam_id,
        question_id,
      },
    });
    res.status(201).json({
      message: "Tạo câu hỏi trong đề thi thành công",
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMultipleExamQuestions = async (req, res) => {
  try {
    const examQuestionsData = req.body;

    if (!Array.isArray(examQuestionsData) || examQuestionsData.length === 0) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ. Phải là một mảng các câu hỏi.",
      });
    }

    const result = await prisma.exam_questions.createMany({
      data: examQuestionsData,
      skipDuplicates: true,
    });

    res.status(201).json({
      message: `Đã thêm thành công ${result.count} câu hỏi vào đề thi`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExamQuestion = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const existing = await prisma.exam_questions.findFirst({
      where: { id, is_delete: "0" },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy câu hỏi trong đề thi" });
    }

    const { exam_id, question_id } = req.body;
    const updatedItem = await prisma.exam_questions.update({
      where: { id: parseInt(id) },
      data: {
        exam_id,
        question_id,
      },
    });

    res.status(200).json({
      message: "Cập nhật câu hỏi trong đề thi thành công",
      data: updatedItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExamQuestion = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const existing = await prisma.exam_questions.findFirst({
      where: { id, is_delete: "0" },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy câu hỏi trong đề thi" });
    }

    const deletedItem = await prisma.exam_questions.update({
      where: { id: parseInt(id) },
      data: { is_delete: "1" },
    });

    res.status(200).json({
      message: "Xóa câu hỏi trong đề thi thành công",
      data: deletedItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
