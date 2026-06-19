const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getQuestions = async (req, res) => {
  try {
    const questions = await prisma.questions.findMany({
      where: { is_delete: "0" },
    });
    res.status(200).json({
      message: "Lấy danh sách câu hỏi thành công",
      data: questions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID câu hỏi không hợp lệ" });
    }

    const question = await prisma.questions.findFirst({
      where: { id, is_delete: "0" },
    });

    if (!question) {
      return res.status(404).json({ message: "Không tìm thấy câu hỏi" });
    }

    res.status(200).json({
      message: "Lấy thông tin câu hỏi thành công",
      data: question,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const {
      vocabulary_id,
      question_type,
      question_text,
      correct_answer,
      wrong_answers,
      is_ai_generated,
      is_approved,
    } = req.body;

    const question = await prisma.questions.create({
      data: {
        vocabulary_id,
        question_type,
        question_text,
        correct_answer,
        wrong_answers,
        is_ai_generated,
        is_approved,
      },
    });

    res.status(201).json({
      message: "Tạo câu hỏi thành công",
      data: question,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID câu hỏi không hợp lệ" });
    }

    const existing = await prisma.questions.findFirst({
      where: { id, is_delete: "0" },
    });

    if (!existing) {
      return res.status(404).json({ message: "Không tìm thấy câu hỏi" });
    }

    const {
      vocabulary_id,
      question_type,
      question_text,
      correct_answer,
      wrong_answers,
      is_ai_generated,
      is_approved,
    } = req.body;

    const updatedQuestion = await prisma.questions.update({
      where: { id },
      data: {
        vocabulary_id,
        question_type,
        question_text,
        correct_answer,
        wrong_answers,
        is_ai_generated,
        is_approved,
      },
    });

    res.status(200).json({
      message: "Cập nhật câu hỏi thành công",
      data: updatedQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID câu hỏi không hợp lệ" });
    }

    const existing = await prisma.questions.findFirst({
      where: { id, is_delete: "0" },
    });

    if (!existing) {
      return res.status(404).json({ message: "Không tìm thấy câu hỏi" });
    }

    const deletedQuestion = await prisma.questions.update({
      where: { id },
      data: { is_delete: "1" },
    });

    res.status(200).json({
      message: "Xóa câu hỏi thành công",
      data: deletedQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
