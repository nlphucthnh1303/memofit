const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const mockMultipleChoice = async (vocab) => {
  const vocabRecords = await prisma.vocabularies.findMany({
    select: { word: true },
  });

  const pool = vocabRecords.map((v) => v.word);

  const filteredPool = pool.filter(
    (word) => word.toLowerCase() !== vocab.word.toLowerCase(),
  );
  const shuffled = filteredPool.sort(() => 0.5 - Math.random());
  const dynamicWrongAnswers = shuffled.slice(0, 3);

  return {
    question_text: `Chọn từ tiếng Anh có nghĩa là "${vocab.meaning}": ___`,
    correct_answer: vocab.word,
    wrong_answers: dynamicWrongAnswers, // Kết quả luôn thay đổi sau mỗi lần gọi
  };
};

const mockClozeTest = (vocab) => {
  let sentence =
    vocab.example_sentence ||
    `It is important to understand the core meaning of this concept before applying it.`;

  const regex = new RegExp(`\\b${vocab.word}\\b`, "gi");
  let question_text = sentence;
  if (sentence.toLowerCase().includes(vocab.word.toLowerCase())) {
    question_text = sentence.replace(regex, "___");
  } else {
    question_text = `Complete the sentence with the correct word (Meaning: ${vocab.meaning}): "The company needs a clear ___ to succeed."`;
  }

  return {
    question_text: question_text,
    correct_answer: vocab.word,
    wrong_answers: ["mock1", "mock2", "mock3"],
  };
};

const generateMultipleChoice = async (vocab) => {
  if (!genAI) return mockMultipleChoice(vocab);

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      Bạn là một chuyên gia khảo thí tiếng Anh sáng tạo. Hãy tạo 1 câu hỏi trắc nghiệm ngẫu nhiên cho từ vựng sau:
      - Từ vựng (Đáp án đúng): "${vocab.word}"
      - Nghĩa của từ: "${vocab.meaning}"
      - Từ loại: "${vocab.pos || "tự do"}"
      
      YÊU CẦU ĐA DẠNG: Mỗi lần gọi, bạn hãy chủ động chọn NGẪU NHIÊN 1 trong 3 dạng câu hỏi dưới đây để viết cho thuộc tính "question_text":
      
      - Dạng 1 (Tìm từ theo nghĩa): Viết bằng tiếng Việt: 'Chọn từ tiếng Anh có nghĩa là "${vocab.meaning.replace(/"/g, '\\"')}"'
      - Dạng 2 (Điền vào chỗ trống câu tiếng Anh): Viết 1 câu ngữ cảnh hoàn toàn bằng tiếng Anh, chứa một ô trống dạng "___" sao cho đáp án đúng bắt buộc phải là "${vocab.word}". Sau đó mở ngoặc thêm nghĩa tiếng Việt ở cuối câu để gợi ý.
      - Dạng 3 (Tìm từ đồng nghĩa/Ngữ cảnh): Viết bằng tiếng Việt yêu cầu tìm từ phù hợp nhất, ví dụ: 'Trong câu "...", từ nào có nghĩa tương đương với "${vocab.meaning.replace(/"/g, '\\"')}"?' hoặc các mẫu tương tự.

      YÊU CẦU ĐÁP ÁN SAI (wrong_answers):
      - Tạo mảng gồm ĐÚNG 3 từ tiếng Anh đóng vai trò đáp án nhiễu.
      - TUYỆT ĐỐI KHÔNG trùng với đáp án đúng "${vocab.word}".
      - Bắt buộc các đáp án sai phải CÙNG TỪ LOẠI với từ đúng để tăng độ thử thách. KHÔNG dùng các từ mẫu ngớ ngẩn (apple, banana) trừ khi từ đang học thuộc nhóm đó.

      Trả về KẾT QUẢ DUY NHẤT bằng định dạng JSON (Không kèm ký tự markdown hoặc lời thoại):
      {
        "question_text": "Chuỗi văn bản câu hỏi ngẫu nhiên vừa tạo",
        "correct_answer": "${vocab.word.replace(/"/g, '\\"')}",
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

let retryCount = 0;
const generateClozeTest = async (vocab) => {
  if (!genAI) return mockClozeTest(vocab);

  const MAX_RETRIES = 2;
  const modelName = retryCount === 0 ? "gemini-2.5-flash" : "gemini-1.5-flash";

  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: { responseMimeType: "application/json" },
    });

    const exampleSentence =
      vocab.example_sentence ||
      `Many experts believe that learning a new language can significantly improve your memory and cognitive skills.`;

    const prompt = `
      Bạn là một chuyên gia ra đề thi tiếng Anh trình độ Intermediate (B1-B2). 
      Hãy tạo một câu hỏi điền từ vào chỗ trống (Cloze Test) chất lượng cao.
      Dữ liệu: Từ="${vocab.word}", Nghĩa="${vocab.meaning}", Câu gốc="${exampleSentence}"

      Yêu cầu:
      1. Lấy câu gốc, thay thế tất cả lần xuất hiện của từ "${vocab.word}" (kể cả số nhiều, chia thì) bằng "___". Nếu câu quá ngắn, tự viết câu mới dài hơn.
      2. Tạo 3 từ bẫy (wrong_answers) cùng loại từ, gây nhiễu tốt ở trình độ Intermediate.

      Trả về JSON:
      {
        "question_text": "Câu văn chứa chỗ trống ___",
        "correct_answer": "${vocab.word.replace(/"/g, '\\"')}",
        "wrong_answers": ["từ bẫy 1", "từ bẫy 2", "từ bẫy 3"]
      }
    `;

    const result = await model.generateContent(prompt);
    let aiText = result.response.text();

    if (aiText.includes("```")) {
      aiText = aiText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    }

    return JSON.parse(aiText);
  } catch (error) {
    if (
      (error.status === 503 || error.status === 429) &&
      retryCount < MAX_RETRIES
    ) {
      const waitTime = (retryCount + 1) * 2000;
      console.warn(
        `[Gemini 503] Model ${modelName} đang quá tải. Đang thử lại lần ${retryCount + 1} sau ${waitTime / 1000}s...`,
      );

      await delay(waitTime);

      return generateClozeTest(vocab, retryCount + 1);
    }
    console.error(
      "Lỗi AI khi tạo CLOZE_TEST (Chuyển sang dùng Mock):",
      error.message || error,
    );
    return await mockClozeTest(vocab);
  }
};

module.exports = {
  generateMultipleChoice,
  generateClozeTest,
};
