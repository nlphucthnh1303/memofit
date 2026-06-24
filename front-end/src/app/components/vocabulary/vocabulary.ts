import { Component, ChangeDetectionStrategy, signal, computed, inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { DialogService } from '../../shared/ui/dialog/dialog.service';
import { ConfirmDialogComponent } from '../demo-ui/demo-ui';
import { VocabulariesService } from '../../services/vocabularies.service';
import { CollectionsService } from '../../services/collections.service';
import { Vocabularies } from '../../models/vocabularies.model';
import { Collections } from '../../models/collections.model';
import { ActivatedRoute, Router } from '@angular/router';
import { of, concatMap, finalize } from 'rxjs';
import { UserVocabularyProgress } from '../../models/user-vocabulary-progress.model';
import { UserVocabularyProgressService } from '../../services/user-vocabulary-progress.service';

@Component({
  selector: 'app-vocabulary',
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vocabulary.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Vocabulary implements OnInit {
  showImportModal = signal<boolean>(false);
  showVocabularyModal = signal<boolean>(false);
  wordsList = signal<Vocabularies[]>([]);
  vocabularies = signal<Vocabularies[]>([]);
  collectionsList = signal<Collections[]>([]);

  // Phân trang
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(10);

  totalPages = computed(() => Math.ceil(this.vocabularies().length / this.itemsPerPage()) || 1);

  paginatedWords = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.vocabularies().slice(start, end);
  });

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, 4, '...', total];
    } else if (current >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total];
    } else {
      return [1, '...', current - 1, current, current + 1, '...', total];
    }
  });

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
  isEditMode = signal<boolean>(false);
  currentCollectionId = signal<number | null>(null);
  currentvocabularyId = signal<number | null>(null);

  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private spinner = inject(NgxSpinnerService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);
  private vocabulariesService = inject(VocabulariesService);
  private collectionsService = inject(CollectionsService);
  private userVocabularyProgressService = inject(UserVocabularyProgressService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  vocabularyForm!: FormGroup;
  activeStatusFilter = signal<string>('ALL');

  importStep = signal<1 | 2 | 3>(1);
  importedWords = [
    { stt: 1, target: 'Resilience', meaning: 'Khả năng phục hồi nhanh chóng', tags: ['IELTS'], status: 'Valid' },
    { stt: 2, target: 'Ephemeral', meaning: 'Phù du, chóng vánh', tags: ['GRE'], status: 'Valid' },
    { stt: 3, target: 'Ubiquitous', meaning: 'Có mặt ở khắp nơi', tags: ['GRE'], status: 'Duplicate' },
    { stt: 4, target: 'Pragmatic', meaning: '-- Thiếu định nghĩa --', tags: ['TOEFL'], status: 'Missing' },
    { stt: 5, target: 'Mitigate', meaning: 'Làm giảm nhẹ, làm dịu', tags: ['IELTS'], status: 'Valid' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.currentCollectionId.set(+id);
        this.getVocabularies(+id);
      }
    });
    this.getCollectionsList();
  }

  private initForm(): void {
    this.vocabularyForm = this.fb.group({
      word: ['', [Validators.required, Validators.minLength(2)]],
      ipa: [''],
      pos: ['Nouns'], // Default
      collection_id: ['', [Validators.required]],
      meaning: ['', [Validators.required, Validators.minLength(5)]],
      example_sentence: ['']
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.vocabularyForm.get(fieldName);
    return !!(control && control.touched && control.invalid);
  }

  getCollectionsList(): void {
    this.collectionsService.getCollections().subscribe({
      next: (res) => {
        this.collectionsList.set(res.data || []);
      }
    });
  }




  searchVocabularies(keysearch: string): void {
    const query = keysearch.trim().toLowerCase();

    if (!query) {
      this.vocabularies.set(this.wordsList());
      return;
    }
    const filtered = this.wordsList().filter(item =>
      item.word?.toLowerCase().includes(query) ||
      item.meaning?.toLowerCase().includes(query)
    );

    this.vocabularies.set(filtered);
  }

  getVocabularies(collectionId: number): void {
    this.spinner.show();
    this.vocabulariesService.getVocabulariesByCollectionId(collectionId).subscribe({
      next: (res) => {
        this.wordsList.set(res.data || []);
        this.searchVocabularies("");
        this.currentPage.set(1);
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastService.show('Không thể tải danh sách từ vựng', 'error');
      }
    });
  }

  goBackToCollections() {
    this.router.navigate(['/dashboard/vocabulary']);
  }

  openImportModal() {
    this.showImportModal.set(true);
    this.importStep.set(2);
  }

  closeImportModal() {
    this.showImportModal.set(false);
  }

  openVocabularyModal() {
    this.isEditMode.set(false);
    this.currentvocabularyId.set(null);
    this.vocabularyForm.reset({
      collection_id: this.currentCollectionId(),
      pos: 'Nouns'
    });
    this.showVocabularyModal.set(true);
  }

  closeVocabularyModal() {
    this.showVocabularyModal.set(false);
  }

  onEditWord(vocabulary: Vocabularies) {
    this.isEditMode.set(true);
    this.currentvocabularyId.set(vocabulary.id!);
    this.vocabularyForm.patchValue({
      word: vocabulary.word,
      ipa: vocabulary.ipa,
      pos: vocabulary.pos || 'Nouns',
      collection_id: vocabulary.collection_id,
      meaning: vocabulary.meaning,
      example_sentence: vocabulary.example_sentence
    });
    this.showVocabularyModal.set(true);
  }

  onDeleteWord(id: number) {
    const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Xóa Từ Vựng',
        message: 'Bạn có chắc chắn muốn xóa từ vựng này?'
      }
    });

    dialogRef.afterClosed$.subscribe(result => {
      if (result) {
        this.spinner.show();
        this.vocabulariesService.deleteVocabulary(id).subscribe({
          next: () => {
            this.toastService.show('Đã xóa từ vựng', 'success');
            if (this.currentCollectionId()) {
              this.getVocabularies(this.currentCollectionId()!);
            }
          },
          error: (err) => {
            this.spinner.hide();
            this.toastService.show('Lỗi khi xóa từ vựng', 'error');
          }
        });
      }
    });
  }

  private getUserLogin() {
    const storageType = localStorage.getItem('storage_type');
    const storage = storageType === 'session' ? sessionStorage : localStorage;
    const userLoginStr = storage.getItem('user_login');
    if (userLoginStr) {
      try {
        return JSON.parse(userLoginStr);
      } catch (e) {
        console.error('Lỗi parse user_login:', e);
      }
    }
    return null;
  }

  onSubmitVocabularyForm(): void {
    if (this.vocabularyForm.invalid) {
      this.vocabularyForm.markAllAsTouched();
      return;
    }

    this.spinner.show();
    let user_login = this.getUserLogin();

    if (!user_login) {
      this.toastService.show('Vui lòng đăng nhập để thực hiện!', 'error');
      this.spinner.hide();
      return;
    }

    const payload: Vocabularies = {
      id: this.isEditMode() ? (this.currentvocabularyId() || undefined) : undefined,
      collection_id: Number(this.vocabularyForm.get('collection_id')?.value),
      word: this.vocabularyForm.get('word')?.value,
      pos: this.vocabularyForm.get('pos')?.value || 'Nouns',
      ipa: this.vocabularyForm.get('ipa')?.value || '',
      meaning: this.vocabularyForm.get('meaning')?.value,
      example_sentence: this.vocabularyForm.get('example_sentence')?.value || '',
      example_meaning: undefined,
      audio_word_path: undefined,
      audio_example_path: undefined,
      created_at: undefined,
      is_delete: undefined
    };

    const request$ = this.isEditMode()
      ? this.vocabulariesService.updateVocabulary(payload.id!, payload)
      : this.vocabulariesService.createVocabulary(payload);

    request$
      .pipe(
        concatMap((resFromFirstApi) => {
          if (!this.isEditMode()) {
            const secondPayload: UserVocabularyProgress = {
              id: undefined,
              user_id: user_login.user.id,
              vocabulary_id: resFromFirstApi?.data?.id,
              repetitions: undefined,
              interval_days: undefined,
              ease_factor: undefined,
              next_review_date: undefined,
              status: undefined,
              last_reviewed_at: undefined,
              is_delete: undefined
            };


            return this.userVocabularyProgressService.createUserVocabularyProgress(secondPayload);
          }
          // Nếu là chế độ CHỈNH SỬA (Edit), không cần gọi API 2, dùng `of(null)` để bỏ qua bước này mượt mà
          return of(null);
        }),

        finalize(() => {
          this.spinner.hide();
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          const successMsg = res?.message || (this.isEditMode() ? 'Cập nhật từ vựng thành công!' : 'Thêm từ vựng thành công!');
          this.toastService.show(successMsg, 'success');
          this.closeVocabularyModal();
          this.getVocabularies(this.currentCollectionId()!);
        },
        error: (err) => {
          console.error('Lỗi khi lưu từ vựng:', err);
          const errorMsg = err?.error?.message || 'Có lỗi xảy ra khi lưu từ vựng!';
          this.toastService.show(errorMsg, 'error');
        }
      });
  }
}
