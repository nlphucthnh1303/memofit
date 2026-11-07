-- AlterTable
ALTER TABLE "quiz_sessions" ADD COLUMN     "exam_id" INTEGER;

-- CreateIndex
CREATE INDEX "idx_quiz_sessions_exam" ON "quiz_sessions"("exam_id");

-- AddForeignKey
ALTER TABLE "quiz_sessions" ADD CONSTRAINT "quiz_sessions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
