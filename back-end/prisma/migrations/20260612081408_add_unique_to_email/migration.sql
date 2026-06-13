-- CreateEnum
CREATE TYPE "question_mode" AS ENUM ('LISTEN_TYPE_MEANING', 'LISTEN_TYPE_WORD', 'SEE_WORD_TYPE_MEANING', 'SEE_MEANING_TYPE_WORD', 'CLOZE_TEST', 'MULTIPLE_CHOICE');

-- CreateEnum
CREATE TYPE "session_mode" AS ENUM ('normal', 'time_attack');

-- CreateEnum
CREATE TYPE "status_type" AS ENUM ('learning', 'mastered', 'warning', 'expired');

-- CreateTable
CREATE TABLE "collections" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "cover_image" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_delete" BIT(1) NOT NULL DEFAULT B'0',

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_questions" (
    "id" SERIAL NOT NULL,
    "exam_id" INTEGER,
    "question_id" INTEGER,
    "is_delete" BIT(1) NOT NULL DEFAULT B'0',

    CONSTRAINT "exam_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "total_questions" INTEGER,
    "time_limit_minutes" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_delete" BIT(1) NOT NULL DEFAULT B'0',

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "vocabulary_id" INTEGER,
    "question_type" "question_mode" NOT NULL,
    "question_text" TEXT,
    "correct_answer" TEXT,
    "wrong_answers" JSONB,
    "is_ai_generated" BOOLEAN DEFAULT false,
    "is_approved" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_delete" BIT(1) NOT NULL DEFAULT B'0',

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_results" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER,
    "vocabulary_id" INTEGER,
    "question_id" INTEGER,
    "user_answer" TEXT,
    "is_correct" BOOLEAN,
    "sm2_score" INTEGER,
    "response_time_ms" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_delete" BIT(1) NOT NULL DEFAULT B'0',

    CONSTRAINT "quiz_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "mode" "session_mode" DEFAULT 'normal',
    "started_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(6),
    "is_delete" BIT(1) NOT NULL DEFAULT B'0',

    CONSTRAINT "quiz_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_vocabulary_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "vocabulary_id" INTEGER,
    "repetitions" INTEGER DEFAULT 0,
    "interval_days" INTEGER DEFAULT 0,
    "ease_factor" DOUBLE PRECISION DEFAULT 2.5,
    "next_review_date" TIMESTAMP(6),
    "status" "status_type" DEFAULT 'learning',
    "last_reviewed_at" TIMESTAMP(6),
    "is_delete" BIT(1) NOT NULL DEFAULT B'0',

    CONSTRAINT "user_vocabulary_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "current_streak" INTEGER DEFAULT 0,
    "longest_streak" INTEGER DEFAULT 0,
    "last_active_date" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_delete" BIT(1) NOT NULL DEFAULT B'0',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" SERIAL NOT NULL,
    "otp" VARCHAR(6) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabularies" (
    "id" SERIAL NOT NULL,
    "collection_id" INTEGER,
    "word" VARCHAR(255) NOT NULL,
    "pos" VARCHAR(50),
    "ipa" VARCHAR(100),
    "meaning" TEXT,
    "example_sentence" TEXT,
    "example_meaning" TEXT,
    "audio_word_path" VARCHAR(255),
    "audio_example_path" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_delete" BIT(1) NOT NULL DEFAULT B'0',

    CONSTRAINT "vocabularies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_quiz_results_user" ON "quiz_results"("session_id");

-- CreateIndex
CREATE INDEX "idx_user_vocab_progress_next_review" ON "user_vocabulary_progress"("next_review_date");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_vocab_collection" ON "vocabularies"("collection_id");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_vocabulary_id_fkey" FOREIGN KEY ("vocabulary_id") REFERENCES "vocabularies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_results_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_results_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "quiz_sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_results_vocabulary_id_fkey" FOREIGN KEY ("vocabulary_id") REFERENCES "vocabularies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quiz_sessions" ADD CONSTRAINT "quiz_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_vocabulary_progress" ADD CONSTRAINT "user_vocabulary_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_vocabulary_progress" ADD CONSTRAINT "user_vocabulary_progress_vocabulary_id_fkey" FOREIGN KEY ("vocabulary_id") REFERENCES "vocabularies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabularies" ADD CONSTRAINT "vocabularies_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
