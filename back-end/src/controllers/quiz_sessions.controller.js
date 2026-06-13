const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getQuizSessions = async (req, res) => {
  try {
    const sessions = await prisma.quiz_sessions.findMany({
      where: { is_delete: "0" },
    });
    res.status(200).json({
      message: "Quiz sessions retrieved successfully",
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
      return res.status(400).json({ message: "Invalid quiz session id" });
    }

    const session = await prisma.quiz_sessions.findFirst({
      where: { id: parseInt(id), is_delete: "0" },
    });

    if (!session) {
      return res.status(404).json({ message: "Quiz session not found" });
    }

    res.status(200).json({
      message: "Quiz session retrieved successfully",
      data: session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuizSession = async (req, res) => {
  try {
    const { user_id, mode, started_at, ended_at } = req.body;
    const session = await prisma.quiz_sessions.create({
      data: {
        user_id,
        mode,
        started_at,
        ended_at,
      },
    });
    res.status(201).json({
      message: "Quiz session created successfully",
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
      return res.status(400).json({ message: "Invalid quiz session id" });
    }

    const existing = await prisma.quiz_sessions.findFirst({
      where: { id: parseInt(id), is_delete: "0" },
    });

    if (!existing) {
      return res.status(404).json({ message: "Quiz session not found" });
    }

    const { user_id, mode, started_at, ended_at } = req.body;
    const updatedSession = await prisma.quiz_sessions.update({
      where: { id: parseInt(id) },
      data: {
        user_id,
        mode,
        started_at,
        ended_at,
      },
    });
    res.status(200).json({
      message: "Quiz session updated successfully",
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
      return res.status(400).json({ message: "Invalid quiz session id" });
    }

    const existing = await prisma.quiz_sessions.findFirst({
      where: { id: parseInt(id), is_delete: "0" },
    });

    if (!existing) {
      return res.status(404).json({ message: "Quiz session not found" });
    }

    const deletedSession = await prisma.quiz_sessions.update({
      where: { id: parseInt(id) },
      data: { is_delete: "1" },
    });

    res.status(200).json({
      message: "Quiz session deleted successfully",
      data: deletedSession,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
