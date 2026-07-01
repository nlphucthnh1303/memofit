const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const questionService = require("../services/question.service");
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

exports.createMultipleQuestions = async (req, res) => {
  try {
    const questions = req.body;
    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    const createdQuestions = await prisma.questions.createManyAndReturn({
      data: questions,
      skipDuplicates: true,
    });

    res.status(201).json({
      message: "Tạo danh sách câu hỏi thành công",
      data: createdQuestions,
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

const prepareQuestionDistribution = (vocabList, targetTotal) => {
  const totalVocabs = vocabList.length;
  if (totalVocabs >= targetTotal) {
    return vocabList
      .sort(() => 0.5 - Math.random())
      .slice(0, targetTotal)
      .map((vocab) => ({
        vocab: vocab,
        count: 1,
      }));
  } else {
    const baseCount = Math.floor(targetTotal / totalVocabs);
    const remainder = targetTotal % totalVocabs;
    return vocabList.map((vocab, index) => ({
      vocab: vocab,
      count: baseCount + (index < remainder ? 1 : 0),
    }));
  }
};

exports.generateAiQuestions = async (req, res) => {
  try {
    const { vocabulary_list, config } = req.body;

    if (!vocabulary_list?.length || !config?.question_types) {
      return res.status(400).json({
        status: "error",
        message: "Thiếu dữ liệu đầu vào hoặc cấu hình",
      });
    }

    // Delegate business logic completely to the service layer
    const aiQuestions = await questionService.processAiQuestions(
      vocabulary_list,
      config,
    );

    res.status(200).json({ status: "success", data: aiQuestions });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Lỗi hệ thống khi tạo câu hỏi" });
  }
};

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

exports.generateStaticQuestions = async (req, res) => {
  try {
    const { vocabulary_list, config } = req.body;

    if (!vocabulary_list?.length || !config?.question_types) {
      return res
        .status(400)
        .json({ error: "Thiếu dữ liệu đầu vào hoặc cấu hình" });
    }

    const targetType = config.question_types;
    const totalQuestionsRequested = vocabulary_list.length;
    const shuffledVocab = shuffleArray(vocabulary_list);
    const selectedVocab = shuffledVocab.slice(0, totalQuestionsRequested);

    const questions = [];

    for (let i = 0; i < selectedVocab.length; i++) {
      const item = selectedVocab[i];
      let questionText = "";
      let correctAnswer = "";
      let answerKey = "";

      // 1. Xác định loại câu hỏi
      switch (targetType) {
        case "LISTEN_TYPE_MEANING":
          questionText = item.word;
          correctAnswer = item.meaning;
          answerKey = "meaning";
          break;

        case "LISTEN_TYPE_WORD":
          questionText = item.word;
          correctAnswer = item.word;
          answerKey = "word";
          break;

        case "SEE_WORD_TYPE_MEANING":
          questionText = `Nghĩa của ${item.word} là gì ?`;
          correctAnswer = item.meaning;
          answerKey = "meaning";
          break;

        case "SEE_MEANING_TYPE_WORD":
          questionText = `Tiếng anh của "${item.meaning}" là gì ?`;
          correctAnswer = item.word;
          answerKey = "word";
          break;

        default:
          questionText = item.word;
          correctAnswer = item.meaning;
          answerKey = "meaning";
      }

      // 2. Call dữ liệu từ Prisma để lấy từ vựng làm đáp án nhiễu (distractors)
      const dbVocabs = await prisma.vocabularies.findMany({
        where: {
          collection_id: item.collection_id,
          id: { not: item.id },
          is_delete: "0",
        },
        select: {
          [answerKey]: true,
        },
      });

      const rawDistractors = dbVocabs.map((v) => v[answerKey]);
      const shuffledDistractors = shuffleArray(rawDistractors).slice(0, 3);
      const options = shuffleArray([...shuffledDistractors, correctAnswer]);

      // 3. Đẩy câu hỏi hoàn chỉnh vào mảng kết quả
      questions.push({
        vocabulary_id: item.id,
        question_type: targetType,
        question: questionText,
        ipa: item.ipa,
        example_sentence: item.example_sentence,
        example_meaning: item.example_meaning,
        options: options,
        correct_answer: correctAnswer,
      });
    }

    return res.status(200).json({
      success: true,
      test_duration: config.test_duration || 60,
      total_questions: questions.length,
      data: questions,
    });
  } catch (error) {
    console.error("Lỗi Generator:", error);
    res.status(500).json({ error: "Lỗi hệ thống khi tạo câu hỏi" });
  }
};

exports.getQuizBySessionIdAndExamId = async (req, res) => {
  try {
    const { exam_id, session_id, user_id } = req.params;

    if (
      Number.isNaN(exam_id) ||
      Number.isNaN(session_id) ||
      Number.isNaN(user_id)
    ) {
      user_id;
      return res
        .status(400)
        .json({ message: "ID phiên làm bài tập hoặc ID đề thi không hợp lệ" });
    }

    const data = await prisma.quiz_sessions.findFirst({
      where: {
        id: parseInt(session_id),
        exam_id: parseInt(exam_id),
        user_id: parseInt(user_id),
      },
      include: {
        quiz_results: true,
      },
    });

    res.status(200).json({
      message: "Lấy thông tin phiên làm bài tập thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
