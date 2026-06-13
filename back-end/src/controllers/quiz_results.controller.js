const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getQuizResults = async (req, res) => {
  try {
    const results = await prisma.quiz_results.findMany({
      where: { is_delete: "0" },
    });
    res.status(200).json({
      message: "Quiz results retrieved successfully",
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
      return res.status(400).json({ message: "Invalid quiz result id" });
    }

    const result = await prisma.quiz_results.findFirst({
      where: { id: parseInt(id), is_delete: "0" },
    });

    if (!result) {
      return res.status(404).json({ message: "Quiz result not found" });
    }

    res.status(200).json({
      message: "Quiz result retrieved successfully",
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
      sm2_score,
      response_time_ms,
    } = req.body;

    const result = await prisma.quiz_results.create({
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
    res.status(201).json({
      message: "Quiz result created successfully",
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
      return res.status(400).json({ message: "Invalid quiz result id" });
    }

    const existing = await prisma.quiz_results.findFirst({
      where: { id: parseInt(id), is_delete: "0" },
    });

    if (!existing) {
      return res.status(404).json({ message: "Quiz result not found" });
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
      message: "Quiz result updated successfully",
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
      return res.status(400).json({ message: "Invalid quiz result id" });
    }

    const existing = await prisma.quiz_results.findFirst({
      where: { id: parseInt(id), is_delete: "0" },
    });

    if (!existing) {
      return res.status(404).json({ message: "Quiz result not found" });
    }

    const deletedResult = await prisma.quiz_results.update({
      where: { id: parseInt(id) },
      data: { is_delete: "1" },
    });
    res.status(200).json({
      message: "Quiz result deleted successfully",
      data: deletedResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
