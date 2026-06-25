/*
  Warnings:

  - A unique constraint covering the columns `[word,pos,collection_id]` on the table `vocabularies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "collections" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "exam_questions" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "exams" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "quiz_results" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "quiz_sessions" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "user_vocabulary_progress" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "vocabularies" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- CreateIndex
CREATE UNIQUE INDEX "vocabularies_word_pos_collection_id_key" ON "vocabularies"("word", "pos", "collection_id");
