import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Subject, Subscription, firstValueFrom, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { CollectionsService } from '../../services/collections.service';
import { VocabulariesService } from '../../services/vocabularies.service';
import { QuestionsService } from '../../services/questions.service';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExamsService } from '../../services/exams.service';
import { Exams } from '../../models/exams.model';
import { Questions } from '../../models/questions.model';
import { ExamQuestionsService } from '../../services/exam-questions.service';
import { ExamQuestions } from '../../models/exam-questions.model';
import { DialogService } from '../../shared/ui/dialog/dialog.service';
import { ConfirmDialogComponent } from '../demo-ui/demo-ui';
@Component({
  selector: 'app-generate-questions',
  imports: [NgxSpinnerModule, FormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './generate-questions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerateQuestions implements OnInit, OnDestroy {
  sourceType = signal<'collection' | 'words'>('collection');

  questionCount = signal<number>(15);
  timeLimit = signal<number>(10);

  selectedCollectionId = signal<number | null>(null);
  selectedQuestionType = signal<string>('MULTIPLE_CHOICE');

  showReviewModal = signal<boolean>(false);
  generatedQuestions = signal<any[]>([]);
  testTitle = signal<string>("Bài kiểm tra Từ vựng - Tuần 1");
  testDescription = signal<string>("");

  collections: any[] = [];
  words: any[] = [];
  selectedWords: any[] = []; // store selected words

  isLoadingCollections = signal<boolean>(false);
  isLoadingWords = signal<boolean>(false);

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  questionTypes = [
    {
      id: 'CLOZE_TEST',
      title: 'Điền vào chỗ trống',
      subtitle: 'CLOZE TEST',
      icon: 'fi-rr-edit'
    },
    {
      id: 'MULTIPLE_CHOICE',
      title: 'Trắc nghiệm',
      subtitle: 'MULTIPLE CHOICE',
      icon: 'fi-rr-list-check'
    }
  ];


  private collectionsService = inject(CollectionsService);
  private vocabulariesService = inject(VocabulariesService);
  private questionsService = inject(QuestionsService);
  private examsService = inject(ExamsService);
  private examQuestionsService = inject(ExamQuestionsService);
  private spinner = inject(NgxSpinnerService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private dialogService = inject(DialogService);
  constructor() { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      try {
        if (params['limit'] && isNaN(Number(params['limit']))) {
          throw new Error("Tham số truy vấn limit sai định dạng");
        }
      } catch (error: any) {
        console.error("Lỗi xác thực tham số:", error.message);
        this.router.navigate(['/']);
        return;
      }
      this.loadCollections();
    });

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(keyword => {
      this.searchWords(keyword);
    });
    this.searchWords(" ");
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadCollections() {
    this.isLoadingCollections.set(true);
    this.collectionsService.getCollections().subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.collections = res.data;
        }
        this.isLoadingCollections.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoadingCollections.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  onSearchChange(event: any) {
    const keyword = event.target.value;
    if (keyword && keyword.trim().length > 0) {
      this.searchSubject.next(keyword.trim());
    } else {
      this.words = [];
      this.cdr.markForCheck();
    }
  }

  searchWords(keyword: string) {
    this.isLoadingWords.set(true);
    this.cdr.markForCheck();
    this.vocabulariesService.getVocabulariesSearch(keyword, 10).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.words = res.data.map((w: any) => ({
            // id: w.id,
            // target: w.word,
            // meaning: w.meaning,
            ...w,
            collection: w.collection_id ? `${w.collections.title}` : 'General',
            selected: this.selectedWords.some(sw => sw.id === w.id)
          }));
        }
        this.isLoadingWords.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoadingWords.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  get selectedWordsCount() {
    return this.selectedWords.length;
  }

  toggleCollection(id: number) {
    this.selectedCollectionId.set(this.selectedCollectionId() === id ? null : id);
  }

  toggleWord(id: number) {
    const word = this.words.find(w => w.id === id);
    if (word) {
      word.selected = !word.selected;
      if (word.selected) {
        if (!this.selectedWords.some(sw => sw.id === id)) {
          this.selectedWords.push(word);
        }
      } else {
        this.selectedWords = this.selectedWords.filter(sw => sw.id !== id);
      }
      this.cdr.markForCheck();
    }
  }

  setTimeLimit(time: number) {
    this.timeLimit.set(time);
  }

  onTypeQuestionCount(event: any) {
    this.questionCount.set(Number(event.target.value));
  }

  onTypeTimeLimit(event: any) {
    this.timeLimit.set(Number(event.target.value));
  }

  openReviewModal() {
    this.generateAiQuestions();
  }

  async generateAiQuestions() {
    let vocabList: any[] = [];
    if (this.sourceType() === 'collection') {
      const colId = this.selectedCollectionId();
      if (!colId) {
        this.toastService.show('Vui lòng chọn bộ sưu tập', 'warning');
        return;
      }
      this.spinner.show();
      try {
        const res = await firstValueFrom(this.vocabulariesService.getVocabulariesByCollectionId(colId));
        if (res && res.data) {
          vocabList = res.data;
        }
      } catch (err) {
        this.spinner.hide();
        this.toastService.show('Lỗi khi tải từ vựng', 'error');
        return;
      }
    } else {
      if (this.selectedWords.length === 0) {
        this.toastService.show('Vui lòng chọn ít nhất 1 từ vựng', 'warning');
        return;
      }
      vocabList = [...this.selectedWords];
    }

    if (vocabList.length === 0) {
      this.spinner.hide();
      this.toastService.show('Không có từ vựng nào để tạo câu hỏi', 'warning');
      return;
    }
    if (vocabList.length > this.questionCount()) {
      vocabList = vocabList.sort(() => 0.5 - Math.random()).slice(0, this.questionCount());
    }

    const config = {
      question_types: this.selectedQuestionType(),
      test_duration: this.timeLimit()
    };


    if (this.sourceType() !== 'collection') {
      this.spinner.show();
    }

    this.questionsService.generateAiQuestions(vocabList, config).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.generatedQuestions.set(res.data);

          if (this.sourceType() === 'collection') {
            const col = this.collections.find(c => c.id === this.selectedCollectionId());
            if (col) {
              this.testTitle.set(`Bài kiểm tra ${col.title} - ${new Date().toLocaleDateString('vi-VN')}`);
            }
          } else {
            this.testTitle.set(`Bài kiểm tra tùy chỉnh - ${new Date().toLocaleDateString('vi-VN')}`);
          }
          this.showReviewModal.set(true);
        }
        this.spinner.hide();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastService.show(err.error?.message || 'Lỗi khi tạo câu hỏi', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  deleteQuestion(index: number) {
    const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Xóa câu hỏi',
        message: 'Bạn có chắc chắn muốn xóa câu hỏi này?'
      }
    });
    dialogRef.afterClosed$.subscribe(result => {
      if (result) {
        const list = [...this.generatedQuestions()];
        list.splice(index, 1);
        this.generatedQuestions.set(list);
        this.toastService.show('Câu hỏi đã được xóa thành công', 'success');
        this.cdr.markForCheck();
      }
    });




  }

  updateQuestionData(index: number, field: string, event: Event) {
    const el = event.target as HTMLElement;
    const list = [...this.generatedQuestions()];
    list[index][field] = el.innerText.trim();
    this.generatedQuestions.set(list);
  }

  updateAnswerData(qIndex: number, aIndex: number, event: Event, isCorrect: boolean) {
    const el = event.target as HTMLElement;
    const list = [...this.generatedQuestions()];
    const val = el.innerText.trim();
    if (isCorrect) {
      list[qIndex].correct_answer = val;
    } else {
      list[qIndex].wrong_answers[aIndex] = val;
    }
    this.generatedQuestions.set(list);
  }

  approveQuestions() {
    const questionsList = this.generatedQuestions();
    if (!questionsList || questionsList.length === 0) {
      this.toastService.show('Không có câu hỏi nào để phê duyệt', 'warning');
      return;
    }

    const finalQuestions: Questions[] = questionsList.map(q => ({
      id: undefined,
      vocabulary_id: q.vocabulary_id,
      question_type: q.question_type,
      question_text: q.question_text,
      correct_answer: q.correct_answer,
      wrong_answers: q.wrong_answers,
      is_ai_generated: true,
      is_approved: true,
      created_at: new Date(),
      is_delete: '0'
    }));


    const exam: Exams = {
      id: undefined,
      title: this.testTitle(),
      description: this.testDescription(),
      total_questions: finalQuestions.length,
      time_limit_minutes: this.timeLimit(),
      created_at: new Date(),
      is_delete: undefined
    };

    this.spinner.show();

    this.examsService.createExam(exam)
      .pipe(
        switchMap((examRes) => {
          const createdExamId = examRes.data.id;

          return this.questionsService.createMultipleQuestions(finalQuestions).pipe(
            switchMap((questionsRes) => {
              const createdQuestions: Questions[] = questionsRes.data;

              if (!createdQuestions || createdQuestions.length === 0) {
                return of(null);
              }


              const examQuestionsPayload: ExamQuestions[] = createdQuestions.map(q => ({
                id: undefined,
                exam_id: createdExamId,
                question_id: q.id,
                is_delete: "0"
              }));

              return this.examQuestionsService.createExamQuestions(examQuestionsPayload);
            })
          );
        })
      )
      .subscribe({
        next: (res) => {
          this.spinner.hide();
          this.toastService.show('Phê duyệt và tạo đề thi thành công!', 'success');
          this.closeReviewModal();
          this.router.navigate(['/dashboard/practice']);
        },
        error: (err) => {
          this.spinner.hide();
          const errorMsg = err.error?.message || 'Có lỗi xảy ra trong quá trình phê duyệt';
          this.toastService.show(errorMsg, 'error');
          console.error('Approve Questions Error:', err);
        }
      });
  }

  closeReviewModal() {
    this.showReviewModal.set(false);
  }
}
