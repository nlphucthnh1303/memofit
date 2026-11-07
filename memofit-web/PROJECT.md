# Project Context: memofit-web

## 1. GENERAL INFORMATION
- **Project Name**: `memofit-web` (Memofit Learner Web Application)
- **Repository Path**: `memofit-web/` (workspace relative: `./memofit-web/`)
- **Architecture Role**: Interactive, gamified language learning web client for English & TOEIC learners. Features 5-Rank Duolingo-style roadmaps, 4 vocabulary practice modes, interactive video learning (Dictation & Shadowing), writing mastery, and VietQR PayOS subscription checkout.

---

## 2. TECHNOLOGY STACK & VERSIONS
- **Framework**: React 19, Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Animations**: Framer Motion, Canvas Confetti
- **Icons**: Lucide React
- **State Management**: Zustand
- **Networking**: Axios

---

## 3. IMPORTANT MODULES & STRUCTURE
- `src/components/common/`: Button3D, ProgressBar, Modal, Confetti
- `src/components/layout/`: MainHeader, FloatingStreakWidget, Navigation
- `src/features/roadmap/`: 5-Rank Duolingo-style S-curve map and Milestone nodes
- `src/features/lesson/`: Interactive micro-learning session (Flashcard, Multiple Choice, Cloze)
- `src/features/video/`: Video Dictation & Shadowing player
- `src/features/writing/`: Sentence construction & grammar practice
- `src/features/exam/`: Timed TOEIC test simulator
- `src/features/payment/`: VietQR PayOS modal & subscription tiers
- `src/stores/`: Game state (Hearts, Streaks, EXP, Sound)

---

## 4. DEVELOPMENT & BUILD COMMANDS
- **Start Dev Server**: `npm run dev` (Default port `5173`)
- **Production Build**: `npm run build`
