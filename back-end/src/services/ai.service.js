const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// 1. Mock fallback methods
const mockMultipleChoice = (vocab) => {
  return {
    question_text: `Chọn từ tiếng Anh có nghĩa là "${vocab.meaning}": ___`,
    correct_answer: vocab.word,
    wrong_answers: ["apple", "banana", "orange"]
  };
};

const mockClozeTest = (vocab) => {
  let sentence = vocab.example_sentence || `This is an example sentence for the word ${vocab.word}.`;
  
  const regex = new RegExp(`\\b${vocab.word}\\b`, "gi");
  let question_text = sentence;
  if (sentence.toLowerCase().includes(vocab.word.toLowerCase())) {
     question_text = sentence.replace(regex, "___");
  } else {
     question_text = `Điền từ thích hợp vào chỗ trống: ___ (nghĩa: ${vocab.meaning})`;
  }

  return {
    question_text: question_text,
    correct_answer: vocab.word,
    wrong_answers: ["mock1", "mock2", "mock3"]
  };
};

// 2. AI Implementations
const generateMultipleChoice = async (vocab) => {
  if (!genAI) return mockMultipleChoice(vocab);
  
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      Bạn là chuyên gia ngôn ngữ. Hãy tạo một câu hỏi trắc nghiệm (điền vào chỗ trống) cho từ vựng tiếng Anh.
      Từ vựng (đáp án đúng): "${vocab.word}"
      Nghĩa của từ: "${vocab.meaning}"
      
      Yêu cầu:
      - Tạo câu hỏi tiếng Việt yêu cầu tìm từ tiếng Anh có nghĩa tương ứng, hoặc câu hỏi ngữ pháp đơn giản chứa chỗ trống (dùng "___" để thay thế từ).
      - Tạo 3 đáp án sai (wrong_answers) là các từ tiếng Anh không liên quan tới đáp án đúng.
      
      Trả về kết quả bằng định dạng JSON sau:
      {
        "question_text": "Câu hỏi với chỗ trống",
        "correct_answer": "${vocab.word}",
        "wrong_answers": ["đáp án sai 1", "đáp án sai 2", "đáp án sai 3"]
      }
    `;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Lỗi AI khi tạo MULTIPLE_CHOICE:", error);
    return mockMultipleChoice(vocab);
  }
};

const generateClozeTest = async (vocab) => {
  if (!genAI) return mockClozeTest(vocab);

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      generationConfig: { responseMimeType: "application/json" },
    });

    const exampleSentence = vocab.example_sentence || `They often use the word ${vocab.word} in this context.`;
    
    const prompt = `
      Bạn là chuyên gia ngôn ngữ. Hãy tạo một câu hỏi điền từ (cloze test) dựa trên câu ví dụ được cung cấp.
      Từ cần điền (đáp án đúng): "${vocab.word}"
      Ý nghĩa của từ: "${vocab.meaning}"
      Câu ví dụ gốc: "${exampleSentence}"
      
      Yêu cầu:
      - Tạo "question_text": Lấy câu ví dụ gốc và thay thế TẤT CẢ các lần xuất hiện của "${vocab.word}" bằng "___".
      - Tạo "wrong_answers": 3 từ vựng tiếng Anh sai, có thể cùng loại từ để gây nhiễu, nhưng KHÔNG được là từ "${vocab.word}".
      
      Trả về kết quả bằng định dạng JSON sau:
      {
        "question_text": "Câu ví dụ với chỗ trống",
        "correct_answer": "${vocab.word}",
        "wrong_answers": ["từ sai 1", "từ sai 2", "từ sai 3"]
      }
    `;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Lỗi AI khi tạo CLOZE_TEST:", error);
    return mockClozeTest(vocab);
  }
};

module.exports = {
  generateMultipleChoice,
  generateClozeTest
};
