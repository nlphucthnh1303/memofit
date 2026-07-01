import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
  OnDestroy,
  computed,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { LayoutService } from "../../services/layout.service";
import { ExamsService } from "../../services/exams.service";
import { QuizSessionsService } from "../../services/quiz-sessions.service";
import { QuizResultsService } from "../../services/quiz-results.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { QuizResults } from "../../models/quiz-results.model";
import { SessionMode, QuizSessions } from "../../models/quiz-sessions.model";
import { ToastService } from "../../shared/ui/toast/toast.service";
import { finalize } from "rxjs/internal/operators/finalize";
import { switchMap } from "rxjs/internal/operators/switchMap";
import { throwError } from "rxjs/internal/observable/throwError";
import { EMPTY } from "rxjs/internal/observable/empty";
import { MatIconModule } from "@angular/material/icon";
@Component({
  selector: "app-practice",
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, MatIconModule],
  templateUrl: "./practice.html",
})
export class Practice implements OnInit, OnDestroy {
  layout = inject(LayoutService);
  xamsService = inject(ExamsService);
  toastService = inject(ToastService);
  examsService = inject(ExamsService);
  quizSessionsService = inject(QuizSessionsService);
  quizResultsService = inject(QuizResultsService);

  currentView = signal<"list" | "session">("list");
  activeFilter = signal<"ALL" | "IT" | "GRAMMAR" | "BUSINESS">("ALL");

  examsList = signal<any[]>([]);
  filteredExamsList = signal<any[]>([]);

  showEditModal = signal(false);
  editExamId = signal<number | null>(null);
  editExamTitle = signal("");
  editExamDesc = signal("");

  sessionId = signal<number | null>(null);
  currentExam = signal<any>(null);
  currentQuestions = signal<any[]>([]);
  currentQuestionIndex = signal<number>(0);
  progressIndex = computed(() => this.currentQuestionIndex() + 1);
  sessionType = signal<"CLOZE_TEST" | "MULTIPLE_CHOICE">("CLOZE_TEST");
  isAnswerRevealed = signal<boolean>(false);

  userClozeInput = signal<string>("");
  selectedMultipleChoice = signal<string>("");
  isCorrect = signal<boolean>(false);

  streak = signal<number>(0);
  correctCount = signal<number>(0);
  timerSeconds = signal<number>(0);
  private timerInterval: any = null;
  private startTime: number = 0;

  endTest = signal<boolean>(false);


  ngOnInit() {
    this.loadExams();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  loadExams() {
    this.examsService.getExams().subscribe((res) => {
      if (res.data) {
        this.examsList.set(res.data);
        this.filterExams(this.activeFilter());
      }
    });
  }

  openEditModal(exam: any) {
    this.editExamId.set(exam.id);
    this.editExamTitle.set(exam.title);
    this.editExamDesc.set(exam.description || "");
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  saveExam() {
    if (!this.editExamTitle().trim()) {
      alert("Vui lòng nhập tên đề thi");
      return;
    }
    const id = this.editExamId();
    if (id) {
      this.examsService
        .updateExam(id, {
          title: this.editExamTitle(),
          description: this.editExamDesc(),
        })
        .subscribe({
          next: () => {
            this.closeEditModal();
            this.loadExams();
          },
          error: (err) => alert("Lỗi khi cập nhật đề thi: " + err.message),
        });
    }
  }

  deleteExam(id: number) {
    if (confirm("Bạn có chắc chắn muốn xóa đề thi này không?")) {
      this.examsService.deleteExam(id).subscribe({
        next: () => {
          this.loadExams();
        },
        error: (err) => alert("Lỗi khi xóa đề thi: " + err.message),
      });
    }
  }

  setFilter(filter: "ALL" | "IT" | "GRAMMAR" | "BUSINESS") {
    this.activeFilter.set(filter);
    this.filterExams(filter);
  }

  filterExams(filter: string) {
    if (filter === "ALL") {
      this.filteredExamsList.set(this.examsList());
    } else {
      this.filteredExamsList.set(
        this.examsList().filter(
          (e: any) =>
            e.title.includes(filter) || e.description?.includes(filter),
        ),
      );
    }
  }

  private getUserLogin() {
    const storageType = localStorage.getItem("storage_type");
    const storage = storageType === "session" ? sessionStorage : localStorage;
    const userLoginStr = storage.getItem("user_login");
    if (userLoginStr) {
      try {
        return JSON.parse(userLoginStr);
      } catch (e) {
        console.error("Lỗi parse user_login:", e);
      }
    }
    return null;
  }

  startPractice(examId: number) {
    this.examsService
      .getExam(examId)
      .pipe(
        switchMap((firstRes) => {
          if (firstRes.data) {
            if (!firstRes || !firstRes.data) {
              return throwError(() => new Error('Không tìm thấy thông tin đề thi!'));
            }

            const exam = firstRes.data;
            this.currentExam.set(exam);

            let questions = exam.exam_questions?.map((eq: any) => eq.questions).filter((q: any) => q) || [];
            console.log('Total Questions received from API:', questions);

            if (questions.length === 0) {
              this.toastService.show("Đề thi này không có câu hỏi nào (Data rỗng)! Vui lòng kiểm tra database.", "warning");
              return EMPTY;
            }

            this.currentQuestions.set(questions);
            this.currentQuestionIndex.set(0);
            this.loadCurrentQuestion();
          }
          const sessionData = new QuizSessions({
            user_id: this.getUserLogin().user.id,
            mode: SessionMode.NORMAL,
            started_at: new Date(),
            exam_id: examId
          });
          return this.quizSessionsService.createQuizSession(sessionData);
        })
      )
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.sessionId.set(res.data.id);
            this.currentView.set('session');
            this.layout.setForceCollapse(true);
            this.startTimer();
            this.streak.set(0);
            this.correctCount.set(0);
          }

        },
        error: (err) => {
          this.toastService.show(err.error.message, 'error');
        },
      });


  }

  exitPractice() {
    this.stopTimer();
    this.currentView.set("list");
    this.layout.setForceCollapse(false);
  }



  get formattedTimer() {
    const s = this.timerSeconds();
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  }

  get accuracy() {
    if (this.currentQuestionIndex() === 0) return 0;
    return Math.round(
      (this.correctCount() / this.currentQuestionIndex()) * 100,
    );
  }

  get progressPercent() {
    if (this.currentQuestions().length === 0) return 0;
    return Math.round(
      (this.progressIndex() / this.currentQuestions().length) * 100,
    );
  }

  loadCurrentQuestion() {
    const q = this.currentQuestions()[this.currentQuestionIndex()];
    console.log(this.currentQuestionObj);
    this.sessionType.set(q.question_type);
    this.isAnswerRevealed.set(false);
    this.userClozeInput.set("");
    this.selectedMultipleChoice.set("");
    this.isCorrect.set(false);
  }

  get currentQuestionObj() {
    if (this.currentQuestions().length === 0) return null;
    return this.currentQuestions()[this.currentQuestionIndex()];
  }

  get currentMultipleChoiceOptions() {
    const q = this.currentQuestionObj;
    if (!q || !q.wrong_answers) return [];
    let opts = [];
    try {
      opts =
        typeof q.wrong_answers === "string"
          ? JSON.parse(q.wrong_answers)
          : q.wrong_answers;
      if (!Array.isArray(opts)) opts = [opts];
    } catch (e) {
      opts = [];
    }
    opts = [q.correct_answer, ...opts];
    return opts;
  }

  selectMultipleChoice(option: string) {
    if (this.isAnswerRevealed()) return;
    this.selectedMultipleChoice.set(option);
    this.checkAnswer();
  }

  checkAnswer() {
    if (this.isAnswerRevealed()) return;
    const q = this.currentQuestionObj;
    if (!q) return;

    let correct = false;

    if (q.question_type === "CLOZE_TEST") {
      correct = this.userClozeInput().toLowerCase().trim() === q.correct_answer?.toLowerCase().trim();
    } else if (q.question_type === "MULTIPLE_CHOICE") {
      if (!this.selectedMultipleChoice()) {
        return;
      };
      correct = this.selectedMultipleChoice().trim() === q.correct_answer?.trim();
    }

    this.isCorrect.set(correct);
    if (correct) {
      this.streak.update((s) => s + 1);
      this.correctCount.update((c) => c + 1);
    } else {
      this.streak.set(0);
    }
    this.isAnswerRevealed.set(true);


    let userAnswer =
      q.question_type === "CLOZE_TEST"
        ? this.userClozeInput()
        : this.selectedMultipleChoice();
    this.stopTimer();
    const resultData = new QuizResults({
      session_id: this.sessionId() ?? 0,
      vocabulary_id: q.vocabulary_id,
      question_id: q.id,
      user_answer: userAnswer,
      is_correct: this.isCorrect(),
      sm2_score: undefined,
      response_time_ms: this.getResponseTimeMs(),
    });

    this.quizResultsService.createQuizResult(resultData).subscribe();
  }

  submitExam() {
    if (this.isAnswerRevealed()) return;
    console.log(this.currentExam());
    console.log(this.sessionId());


  }

  startTimer() {
    this.stopTimer();
    this.startTime = Date.now();
    this.timerSeconds.set(0);
    this.timerInterval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
      this.timerSeconds.set(elapsedSeconds);
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  getResponseTimeMs(): number {
    if (this.startTime === 0) return 0;
    return Date.now() - this.startTime; // Trả về mili-giây chính xác tuyệt đối
  }

  nextQuestion() {
    if (this.currentQuestionIndex() < this.currentQuestions().length - 1) {
      this.currentQuestionIndex.update((i) => i + 1);
      this.loadCurrentQuestion();
      this.startTimer();
    } else {
      this.endTest.set(true);
      // this.exitPractice();
    }
  }




  prevQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update((i) => i - 1);
      this.loadCurrentQuestion();
      this.startTimer();
    }
  }


  clozeParts() {
    const q = this.currentQuestionObj;
    if (!q || !q.question_text) return { before: "", after: "" };
    const split = q.question_text.split("........");
    if (split.length >= 2) {
      return { before: split[0], after: split[1] };
    }
    return { before: q.question_text, after: "" };
  }
}
