const aiService = require("./ai.service");

exports.processAiQuestions = async (vocabularyList, config) => {
  const { question_types } = config;
  const questions = [];

  for (let i = 0; i < vocabularyList.length; i++) {
    const vocab = vocabularyList[i];
    let aiResult;

    try {
      if (question_types === "MULTIPLE_CHOICE") {
        aiResult = await aiService.generateMultipleChoice(vocab);
      } else if (question_types === "CLOZE_TEST") {
        aiResult = await aiService.generateClozeTest(vocab);
      } else {
        throw new Error("Loại câu hỏi không được hỗ trợ");
      }

      if (aiResult) {
        questions.push({
          id: Date.now() + i, // Mock ID temporarily needed for frontend presentation
          vocabulary_id: vocab.id,
          question_type: question_types,
          question_text: aiResult.question_text,
          correct_answer: aiResult.correct_answer,
          wrong_answers: aiResult.wrong_answers,
          is_ai_generated: true,
          is_approved: false,
        });
      }
    } catch (error) {
      console.error(`Lỗi tạo câu hỏi cho từ vựng ID ${vocab.id}:`, error);
    }
  }

  return questions;
};