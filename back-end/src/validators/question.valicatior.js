// src/validators/QuestionValidator.js
import { z } from "zod";

const QuestionSchema = z
  .object({
    question_text: z.string().min(10, "Câu hỏi quá ngắn"),
    correct_answer: z.string().min(1),
    wrong_answers: z.array(z.string()).length(3), // Bắt buộc phải có đúng 3 đáp án sai
  })
  .refine((data) => !data.wrong_answers.includes(data.correct_answer), {
    message: "Đáp án đúng không được trùng với đáp án sai",
    path: ["wrong_answers"],
  });

export const validateQuestion = (data) => QuestionSchema.parse(data);
