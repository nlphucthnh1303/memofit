const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getUserVocabularyProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const userVocabularyProgress =
      await prisma.user_vocabulary_progress.findUnique({
        where: { id: parseInt(id), is_delete: "0" },
      });
    if (!userVocabularyProgress) {
      return res
        .status(404)
        .json({ error: "User vocabulary progress not found" });
    }
    res.status(200).json({
      message: "User vocabulary progress retrieved successfully",
      data: userVocabularyProgress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUserVocabularyProgress = async (req, res) => {
  try {
    const {
      user_id,
      vocabulary_id,
      repetitions,
      interval_days,
      ease_factor,
      next_review_date,
      status,
      last_reviewed_at,
    } = req.body;

    const userVocabularyProgress = await prisma.user_vocabulary_progress.create(
      {
        data: {
          user_id,
          vocabulary_id,
          repetitions,
          interval_days,
          ease_factor,
          next_review_date,
          status,
          last_reviewed_at,
        },
      },
    );
    res.status(201).json({
      message: "User vocabulary progress created successfully",
      data: userVocabularyProgress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserVocabularyProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user_id,
      vocabulary_id,
      repetitions,
      interval_days,
      ease_factor,
      next_review_date,
      status,
      last_reviewed_at,
    } = req.body;
    const userVocabularyProgress = await prisma.user_vocabulary_progress.update(
      {
        where: { id: parseInt(id), is_delete: "0" },
        data: {
          user_id,
          vocabulary_id,
          repetitions,
          interval_days,
          ease_factor,
          next_review_date,
          status,
          last_reviewed_at,
        },
      },
    );
    res.status(200).json({
      message: "User vocabulary progress updated successfully",
      data: userVocabularyProgress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserVocabularyProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const userVocabularyProgress = await prisma.user_vocabulary_progress.update(
      {
        where: { id: parseInt(id), is_delete: "0" },
        data: { is_delete: "1" },
      },
    );
    res.status(200).json({
      message: "User vocabulary progress deleted successfully",
      data: userVocabularyProgress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
