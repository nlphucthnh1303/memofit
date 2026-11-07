/*
  Warnings:

  - You are about to drop the column `audio_example_path` on the `vocabularies` table. All the data in the column will be lost.
  - You are about to drop the column `audio_word_path` on the `vocabularies` table. All the data in the column will be lost.

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
