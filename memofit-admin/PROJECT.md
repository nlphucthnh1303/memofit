# Project Context: memofit-admin

## 1. GENERAL INFORMATION
- **Project Name**: `memofit-admin` (Memofit Admin Management Portal)
- **Repository Path**: `memofit-admin/` (workspace relative: `./memofit-admin/`)
- **Architecture Role**: Back-office management portal for user management, learning roadmap configuration, content/video curation, AI question approval, and exam administration.

---

## 2. TECHNOLOGY STACK & VERSIONS
- **Technology Stack**: TypeScript, Angular 21, Angular SSR, Angular Material, Tailwind CSS v4, Motion, ONNX Runtime Web, RxJS, Vitest, ESLint
- **Framework and Version**:
  - Angular Core & Common: `^21.2.17`
  - Angular Router: `^21.2.17`
  - Angular CDK & Material: `^21.0.0`
  - Angular SSR & Server: `^21.0.0`
  - Motion Animation: `^12.23.24`
  - Tailwind CSS: `^4.1.12` (via `@tailwindcss/postcss`)
  - Google GenAI SDK: `@google/genai` `^2.4.0`
  - ONNX Runtime Web: `onnxruntime-web` `^1.27.0` (Piper TTS)
  - Ngx-Spinner: `^21.1.0`
- **Runtime Versions**: Node.js `v24.18.0`, TypeScript `~5.9.2`
- **Database**: Reactive client-side state (RxJS / Signals); communicates with `back-end` REST API via HTTP services
- **Frontend Architecture**: Standalone component architecture with Angular SSR

---

## 3. ARCHITECTURE & IMPORTANT MODULES
- **Architecture**: Modern Standalone Component Architecture with Server-Side Rendering (SSR):
  - `src/app/components/`: Feature-sliced modular components
  - `src/app/services/`: HTTP API clients, state handling, SM-2 client calculations, audio synthesis
  - `src/app/models/`: Strongly typed TypeScript interfaces
  - `src/app/guards/`: Navigation & authentication route guards
  - `src/app/interceptor/`: HTTP token and response interceptors
  - `src/app/environments/`: Environment endpoint definitions
  - `src/server.ts`: Express server for Angular SSR rendering
- **Important Modules & Entry Points**:
  - `src/app/app.ts`: Root application component, layout binding, theme orchestration
  - `src/app/app.routes.ts`: Application routes (`/dashboard`, `/vocabulary`, `/collection`, `/practice`, `/generate-questions`, `/streak`, `/login`, `/register`, `/settings`)
  - `src/app/services/auth.service.ts`: User authentication, JWT tokens, profile state
  - `src/app/services/vocabularies.service.ts`: Vocabulary API consumption, card operations, Excel sync
  - `src/app/services/collections.service.ts`: Vocabulary collections and tag management
  - `src/app/services/quiz_sm2.service.ts`: Client-side SuperMemo-2 (SM-2) algorithm calculations
  - `src/app/services/piper-tts.service.ts`: Neural Text-To-Speech engine using `onnxruntime-web`
  - `src/app/services/questions.service.ts`: Question fetching, answering, evaluation
  - `src/app/services/dashboard.service.ts`: Dashboard analytics, study stats, streak tracking
  - `src/app/components/practice/`: Flashcard flip card, multiple choice quiz, cloze tests
  - `src/app/components/vocabulary/`: Word management grid, pronunciation trigger, detail view
  - `src/app/components/collection/`: Collection organizing and set cards
  - `src/app/components/generate-questions/`: AI-assisted question generation interface
  - `src/app/components/streak/`: Daily study streak tracking widget

---

## 4. APPLICABLE STANDARDS
All frontend development in this repository must strictly adhere to the following shared framework standards:
- [Architecture Standard](../AI-FRAMEWORK/.ai/standards/architecture.md) — Modular component hierarchy, Service-Component decoupling
- [Coding Standard](../AI-FRAMEWORK/.ai/standards/coding.md) — Strict TypeScript typing, immutability, clean code
- [Performance Standard](../AI-FRAMEWORK/.ai/standards/performance.md) — OnPush change detection, lazy loading, asset optimization
- [Security Standard](../AI-FRAMEWORK/.ai/standards/security.md) — XSS prevention, DOM sanitization, safe token storage
- [Testing Standard](../AI-FRAMEWORK/.ai/standards/testing.md) — Component unit tests and service spec guidelines

---

## 5. SPECIAL CONSTRAINTS & DESIGN RULES
- **Tailwind CSS v4**: Built with `@tailwindcss/postcss` and `postcss` (`^8.5.3`).
- **No Unsolicited helperText**: Tuyệt đối không tự ý thêm `helperText` cho bất kỳ `Input`, `Select`, `DatePicker`, `Textarea` hoặc form field nào nếu không có yêu cầu cụ thể từ người dùng.
- **ONNX Web Neural TTS**: Neural speech synthesis requires proper WASM asset configuration and browser audio context management.
- **Server-Side Rendering (SSR)**: Code running during initial SSR render must guard against direct `window` or `document` DOM access.

---

## 6. DEVELOPMENT & TEST COMMANDS
- **Development Server**: `npm run dev` (`cross-env ng serve --port=3000 --host=0.0.0.0 --allowed-hosts=true ${DISABLE_HMR:+--live-reload=false}`)
- **Standard Serve**: `npm start` (`ng serve`)
- **Production Build**: `npm run build` (`ng build`)
- **SSR Server**: `npm run serve:ssr:app` (`node dist/app/server/server.mjs`)
- **Test Commands**:
  - Unit tests: `npm test` (Vitest `^4.0.0` / `ng test`)
  - Linter: `npm run lint` (ESLint `^9.39.1` + `angular-eslint` `21.1.0`)
