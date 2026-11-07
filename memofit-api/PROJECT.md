# Project Context: memofit-api

## 1. GENERAL INFORMATION
- **Project Name**: `memofit-api` (Memofit Central REST API & Worker Engine)
- **Repository Path**: `memofit-api/` (workspace relative: `./memofit-api/`)
- **Architecture Role**: Central REST API service handling authentication, vocabulary management, AI-driven question generation, SuperMemo-2 (SM-2) spaced repetition interval calculation, exams, quiz sessions, and user progress tracking.

---

## 2. TECHNOLOGY STACK & VERSIONS
- **Technology Stack**: Node.js, Express, JavaScript, Prisma ORM, PostgreSQL, Zod, JWT, Google Generative AI, Swagger UI
- **Framework and Version**: Express `^5.2.1`
- **Runtime Versions**: Node.js `v24.18.0` (compatible with modern Node.js v20+)
- **Database**:
  - PostgreSQL accessed via Prisma ORM (`@prisma/client` `^5.21.0`, `prisma` `^5.21.0`)
  - Database schema defined in `prisma/schema.prisma`
  - MongoDB driver also declared (`mongoose` `^9.7.2`)
- **Frontend**: None (Backend REST API service)
- **AI Engine**: Google Generative AI (`@google/generative-ai` `^0.24.1`) for automatic question and distractor generation

---

## 3. ARCHITECTURE & IMPORTANT MODULES
- **Architecture**: Layered MVC & Clean Service-oriented architecture:
  - `src/config/`: Configuration modules (Swagger, database connection, environment)
  - `src/controllers/`: HTTP request handling and response serialization
  - `src/middleware/`: Authentication (`auth.middleware.js`), validation, error handling
  - `src/routes/`: Route declarations and controller binding
  - `src/services/`: Core business logic (AI generation, question construction, email)
  - `src/validators/`: Request validation schemas using Zod (`^4.4.3`)
  - `prisma/`: Database schema, migration history (`prisma/migrations/`)
- **Important Modules & Entry Points**:
  - `src/app.js`: Express server initialization, middleware configuration, API route mounting, static `/uploads` serving, `/api-docs` Swagger UI setup
  - `src/routes/auth.route.js` & `src/controllers/auth.controller.js`: User registration, OTP verification, JWT login, password reset
  - `src/routes/vocabularies.route.js` & `src/controllers/vocabularies.controller.js`: Vocabulary CRUD, Excel template import/export
  - `src/routes/collections.route.js` & `src/controllers/collections.controller.js`: User vocabulary collections & sets
  - `src/routes/user_vocabulary_progress.route.js` & `src/controllers/user_vocabulary_progress.controller.js`: SM-2 repetition, Ease Factor, interval days, next review date
  - `src/routes/questions.route.js` & `src/controllers/questions.controller.js`: Question bank management
  - `src/routes/exams.route.js` & `src/controllers/exams.controller.js`: Exam creation, timing, evaluation
  - `src/routes/quiz_sessions.route.js` & `src/controllers/quiz_sessions.controller.js`: Practice sessions & interactive quiz rounds
  - `src/routes/quiz_results.route.js` & `src/controllers/quiz_results.controller.js`: Practice history & scoring
  - `src/routes/dashboard.route.js` & `src/controllers/dashboard.controller.js`: User dashboard statistics & streak counter
  - `src/services/ai.service.js`: Gemini AI prompt templates & automated question generator
  - `src/services/question.service.js`: Question formatting & data transformation
  - `src/config/swagger.js`: OpenAPI 3.0 documentation configuration
  - `prisma/schema.prisma`: Relational models (`users`, `collections`, `vocabularies`, `questions`, `exams`, `exam_questions`, `quiz_sessions`, `quiz_results`, `user_vocabulary_progress`, `notifications`)

---

## 4. APPLICABLE STANDARDS
All backend development in this repository must strictly adhere to the following shared framework standards:
- [API Standard](../AI-FRAMEWORK/.ai/standards/api.md) — Unified JSON response envelope (`{ status, data, message }`), HTTP status codes, error codes
- [Architecture Standard](../AI-FRAMEWORK/.ai/standards/architecture.md) — Layered separation, Controller-Service decoupling, no business logic in controllers
- [Coding Standard](../AI-FRAMEWORK/.ai/standards/coding.md) — Clean code, naming conventions, defensive null checks
- [Database Standard](../AI-FRAMEWORK/.ai/standards/database.md) — Migration safety, foreign key integrity, index optimizations
- [Security Standard](../AI-FRAMEWORK/.ai/standards/security.md) — Input sanitization, JWT validation, SQL injection prevention via Prisma
- [Logging Standard](../AI-FRAMEWORK/.ai/standards/logging.md) — Structured logging, error stack traces, no sensitive credentials in logs
- [Testing Standard](../AI-FRAMEWORK/.ai/standards/testing.md) — Unit and integration test guidelines

---

## 5. SPECIAL CONSTRAINTS & BUSINESS RULES
- **SuperMemo-2 (SM-2) Spaced Repetition**: Intervals must be calculated using Ease Factor (minimum 1.3), repetition count, and quality score (0 to 5) per the SM-2 algorithm.
- **AI Question Generation**: Uses `@google/generative-ai` with Gemini models. Generation prompts must output valid JSON arrays conforming to question schema types (multiple choice, cloze fill-in-the-blank).
- **Soft Deletes**: Tables utilize `is_delete` flag (`@db.Bit(1)`). Queries must filter active records (`is_delete = '0'`).
- **File Uploads**: Handled via `multer` into `uploads/` directory; static files served at `/uploads`.

---

## 6. DEVELOPMENT & TEST COMMANDS
- **Start Server**: `npm start` (executes `node src/app.js`)
- **Default Port**: `3000` (configurable via `PORT` in `.env`)
- **API Documentation**: Accessible at `http://localhost:3000/api-docs` when server is running
- **Prisma Migrations**: `npx prisma migrate dev` / `npx prisma generate`
- **Test Commands**:
  - Unit tests: `UNKNOWN` (unconfigured test runner; `package.json` script placeholder: `npm test`)
