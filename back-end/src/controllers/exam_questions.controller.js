const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getExamQuestions = async (req, res) => {
  try {
    const items = await prisma.exam_questions.findMany({
      where: { is_delete: "0" },
    });
    res.status(200).json({
      message: "Exam questions retrieved successfully",
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
      return res.status(400).json({ message: "Invalid id" });
    }

    const item = await prisma.exam_questions.findFirst({
      where: { id, is_delete: "0" },
    });

    if (!item) {
      return res.status(404).json({ message: "Exam question not found" });
    }

    res.status(200).json({
      message: "Exam question retrieved successfully",
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
      message: "Exam question created successfully",
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExamQuestion = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const existing = await prisma.exam_questions.findFirst({
      where: { id, is_delete: "0" },
    });

    if (!existing) {
      return res.status(404).json({ message: "Exam question not found" });
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
      message: "Exam question updated successfully",
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
      return res.status(400).json({ message: "Invalid id" });
    }

    const existing = await prisma.exam_questions.findFirst({
      where: { id, is_delete: "0" },
    });

    if (!existing) {
      return res.status(404).json({ message: "Exam question not found" });
    }

    const deletedItem = await prisma.exam_questions.update({
      where: { id: parseInt(id) },
      data: { is_delete: "1" },
    });

    res.status(200).json({
      message: "Exam question deleted successfully",
      data: deletedItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
