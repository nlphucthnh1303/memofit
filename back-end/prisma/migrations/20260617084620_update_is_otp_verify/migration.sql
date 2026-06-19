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
ALTER TABLE "users" ADD COLUMN     "isOtpVerify" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "is_delete" DROP DEFAULT,
ALTER COLUMN "is_delete" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "vocabularies" ALTER COLUMN "is_delete" SET DEFAULT B'0';
