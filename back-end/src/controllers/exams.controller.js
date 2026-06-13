const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getExams = async (req, res) => {
  try {
    const exams = await prisma.exams.findMany({
      where: { is_delete: "0" },
    });
    res.status(200).json({
      message: "Exams retrieved successfully",
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
      return res.status(400).json({ message: "Invalid exam id" });
    }

    const exam = await prisma.exams.findFirst({
      where: { id, is_delete: "0" },
    });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json({
      message: "Exam retrieved successfully",
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
      message: "Exam created successfully",
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
      return res.status(400).json({ message: "Invalid exam id" });
    }

    const exam = await prisma.exams.findFirst({
      where: { id, is_delete: "0" },
    });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
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
      message: "Exam updated successfully",
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
      return res.status(400).json({ message: "Invalid exam id" });
    }

    const exam = await prisma.exams.findFirst({
      where: { id, is_delete: "0" },
    });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const deletedExam = await prisma.exams.update({
      where: { id },
      data: { is_delete: "1" },
    });

    res.status(200).json({
      message: "Exam deleted successfully",
      data: deletedExam,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
