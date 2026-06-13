/*
  Warnings:

  - Added the required column `email` to the `password_resets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "password_resets" DROP CONSTRAINT "password_resets_user_id_fkey";

-- AlterTable
ALTER TABLE "collections" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "exam_questions" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "exams" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "password_resets" ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "quiz_results" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "quiz_sessions" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "user_vocabulary_progress" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AlterTable
ALTER TABLE "vocabularies" ALTER COLUMN "is_delete" SET DEFAULT B'0';

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
