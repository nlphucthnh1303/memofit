import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import mongoose from "mongoose";
const { SchemaType } = mongoose;
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getQuestionSchema = (allowedTypes) => {
  // 1. Chuyển allowedTypes từ chuỗi thành Mảng để làm enum hợp lệ
  const typesArray =
    typeof allowedTypes === "string"
      ? allowedTypes.split(",").map((item) => item.trim())
      : Array.isArray(allowedTypes)
        ? allowedTypes
        : [];

  // 2. Trả về cấu trúc schema đúng chuẩn Gemini
  return {
    type: "OBJECT", // Sử dụng string viết hoa "OBJECT" thay vì SchemaType.OBJECT
    properties: {
      questions: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            vocabulary_id: {
              type: "INTEGER",
            },
            question_type: {
              type: "STRING",
              enum: typesArray,
            },
            question_text: {
              type: "STRING",
            },
            correct_answer: {
              type: "STRING",
            },
            wrong_answers: {
              type: "ARRAY",
              items: {
                type: "STRING",
              },
            },
          },
          required: [
            "vocabulary_id",
            "question_type",
            "question_text",
            "correct_answer",
            "wrong_answers",
          ],
        },
      },
    },
    required: ["questions"],
  };
};

export const generateAiQuestion = async (batch, allowedTypes) => {
  const dynamicSchema = getQuestionSchema(allowedTypes);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
    systemInstruction: `
      Bạn là chuyên gia ngôn ngữ. Hãy tạo đề thi trắc nghiệm dựa trên danh sách từ vựng cung cấp.
      Với mỗi từ, tạo ĐÚNG số lượng câu hỏi đã yêu cầu.
      Loại câu hỏi được phép: ${allowedTypes}.
      YÊU CẦU: Mỗi câu hỏi phải có ngữ cảnh, cấu trúc và nội dung khác biệt hoàn toàn.
    `,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: dynamicSchema,
    },
  });

  const prompt = `Danh sách cần tạo: ${JSON.stringify(batch)}`;
  const result = await model.generateContent(prompt);

  return JSON.parse(result.response.text()).questions;
};
