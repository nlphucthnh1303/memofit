import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
  OnDestroy,
  computed,
  effect,
  ChangeDetectorRef,
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
import { QuestionsService } from "../../services/questions.service";
import moment from 'moment';
import { tap } from "rxjs/internal/operators/tap";
import { map } from "rxjs/internal/operators/map";
import { catchError, of, Subject, debounceTime, distinctUntilChanged } from "rxjs";

@Component({
  selector: "app-practice",
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, MatIconModule],
  templateUrl: "./practice.html",
})
export class Practice implements OnInit, OnDestroy {
  layout = inject(LayoutService);
  toastService = inject(ToastService);
  examsService = inject(ExamsService);
  quizesService = inject(QuestionsService)
  quizSessionsService = inject(QuizSessionsService);
  quizResultsService = inject(QuizResultsService);

  currentView = signal<"list" | "session" | 'finish'>("list");
  activeFilter = signal<"ALL" | "IT" | "GRAMMAR" | "BUSINESS">("ALL");

  examsList = signal<any[]>([]);
  filteredExamsList = signal<any[]>([]);

  searchExam = signal<string>('');
  sortExam = signal<string>('desc');
  private searchSubject = new Subject<string>();

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
  timerSessions = signal<number>(0);
  private timerSessionsInterval: any = null;



  private timerInterval: any = null;
  private startTime: number = 0;

  endTest = signal<boolean>(false);
  listMultipleChoiceOptions: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      const currentIndex = this.currentQuestionIndex();
      this.multipleChoiceOptions();
    });
  }

  multipleChoiceOptions() {
    const q = this.currentQuestionObj;
    if (!q || !q.wrong_answers) {
      this.listMultipleChoiceOptions = [];
      return;
    }

    let opts: any[] = [];
    try {
      opts = typeof q.wrong_answers === "string"
        ? JSON.parse(q.wrong_answers)
        : q.wrong_answers;

      if (!Array.isArray(opts)) opts = [opts];
    } catch (e) {
      opts = [];
    }

    const combinedOptions = [q.correct_answer, ...opts];
    for (let i = combinedOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combinedOptions[i], combinedOptions[j]] = [combinedOptions[j], combinedOptions[i]];
    }

    this.listMultipleChoiceOptions = combinedOptions;
  }



  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((searchTerm) => {
      this.searchExam.set(searchTerm);
      this.loadExams();
    });

    this.loadExams();
    let st = Date.now();
    this.timerSessions.set(0);
    this.timerSessionsInterval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - st) / 1000);
      this.timerSessions.set(elapsedSeconds);
    }, 1000);
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  onSearchChange(event: any) {
    this.searchSubject.next(event.target.value);
  }

  toggleSortExam() {
    this.sortExam.set(this.sortExam() === 'desc' ? 'asc' : 'desc');
    this.loadExams();
  }

  loadExams() {
    this.examsService.getExams(this.searchExam(), this.sortExam()).subscribe((res) => {
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

            let questions = exam.exam_questions?.map((eq: any) => {
              return {
                is_selected: false,
                is_correct: false,
                user_answer: undefined,
                options: [],
                ...eq.questions
              }
            })?.filter((q: any) => q) || [];



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
    window.location.reload();
  }

  get formattedTimer() {
    const s = this.timerSessions();
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  }


  get progressPercent() {
    if (this.currentQuestions().length === 0) return 0;
    return Math.round(
      (this.progressIndex() / this.currentQuestions().length) * 100,
    );
  }

  loadCurrentQuestion() {
    const q = this.currentQuestions()[this.currentQuestionIndex()];
    this.sessionType.set(q.question_type);
    if (q.is_selected) {
      this.isAnswerRevealed.set(true);
      if (q.question_type === "CLOZE_TEST") {
        this.userClozeInput.set(q.user_answer || "");
      } else if (q.question_type === "MULTIPLE_CHOICE") {
        this.selectedMultipleChoice.set(q.user_answer || "");
      }
      this.isCorrect.set(q.is_correct);
    } else {
      this.isAnswerRevealed.set(false);
      this.userClozeInput.set("");
      this.selectedMultipleChoice.set("");
      this.isCorrect.set(false);
    }
  }

  get currentQuestionObj() {
    if (this.currentQuestions().length === 0) return null;
    return this.currentQuestions()[this.currentQuestionIndex()];
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
      if (!this.userClozeInput() || !this.userClozeInput().trim()) return;
      correct = this.userClozeInput().toLowerCase().trim() === q.correct_answer?.toLowerCase().trim();
    } else if (q.question_type === "MULTIPLE_CHOICE") {
      if (!this.selectedMultipleChoice()) {
        return;
      };
      correct = this.selectedMultipleChoice().trim() === q.correct_answer?.trim();
    }

    this.isCorrect.set(correct);
    if (correct) {
      this.toastService.show('Chính xác!', 'success');
      this.streak.update((s) => s + 1);
      this.correctCount.update((c) => c + 1);
    } else {
      this.toastService.show('Sai rồi!', 'error');
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
    this.currentQuestions()[this.currentQuestionIndex()].user_answer = userAnswer;
    this.currentQuestions()[this.currentQuestionIndex()].is_correct = this.isCorrect();
    this.currentQuestions()[this.currentQuestionIndex()].is_selected = true;
    this.currentQuestions()[this.currentQuestionIndex()].options = this.listMultipleChoiceOptions;
    this.quizResultsService.createQuizResult(resultData).subscribe();
  }


  finishExam = signal<boolean>(false);
  accuracy = signal<number>(0);
  quantityCorrect = signal<number>(0);

  submitExam() {
    this.quizesService.getQuizBySessionIdAndExamId(
      this.currentExam()?.id,
      this.sessionId()
    ).pipe(

      tap(() => {
        this.finishExam.set(true);
        this.currentView.set('finish');
        this.toastService.show("Hoàn Thành Bài Kiểm Tra", "success");
      }),
      map(res => {
        const quizes = res?.data?.quiz_results || [];
        console.log(res)
        if (quizes.length === 0) return { count: 0, total: 0 };

        const count = quizes.reduce((acc: number, curr: { is_correct: any; }) => curr.is_correct ? acc + 1 : acc, 0);
        return { count, total: quizes.length, start_at: res.data.started_at };
      }),
      catchError(err => {
        console.error("Error fetching quiz:", err);
        this.toastService.show(err.error?.messages || "Có lỗi xảy ra", "error");
        return of(null);
      })
    ).subscribe(result => {
      if (!result) return;

      this.quantityCorrect.set(result.count);
      this.accuracy.set(result.total > 0 ? Math.round((result.count / result.total) * 100) : 0);
      if (this.timerSessionsInterval) {
        clearInterval(this.timerSessionsInterval);
        this.timerSessionsInterval = null;
      }
      this.quizSessionsService.updateTimeEndQuizSession(this.sessionId(), { ended_at: moment(result.start_at).add(this.timerSessions(), 'seconds') }).subscribe();
    });
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
    const split = q.question_text.split("___");
    if (split.length >= 2) {
      return { before: split[0], after: split[1] };
    }
    return { before: q.question_text, after: "" };
  }
}
