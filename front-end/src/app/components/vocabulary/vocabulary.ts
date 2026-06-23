import { Component, ChangeDetectionStrategy, signal, inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { CollectionsService } from '../../services/collections.service';
import { UploadService } from '../../services/upload.service';
import { concatMap, finalize, of, pipe } from 'rxjs'
import { Collections } from '../../models/collections.model';
import { DialogService } from '../../shared/ui/dialog/dialog.service';
import { ConfirmDialogComponent } from '../demo-ui/demo-ui';
import { VocabulariesService } from '../../services/vocabularies.service';
import { Vocabularies } from '../../models/vocabularies.model';
@Component({
  selector: 'app-vocabulary',
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vocabulary.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Vocabulary {
  currentView = signal<'collections' | 'words'>('collections');
  showImportModal = signal<boolean>(false);
  showCollectionModal = signal<boolean>(false);
  showVocabularyModal = signal<boolean>(false);
  collectionsList = signal<Collections[]>([]);
  wordsList = signal<Vocabularies[]>([]);
  isEditMode = signal<boolean>(false);
  currentCollectionId = signal<number | null>(null);
  currentvocabularyId = signal<number | null>(null);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);
  private fb = inject(FormBuilder);
  private spinner = inject(NgxSpinnerService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);
  private collectionsService = inject(CollectionsService);
  private vocabulariesService = inject(VocabulariesService);

  collectionForm!: FormGroup;
  vocabularyForm!: FormGroup;


  imagePreview: string | SafeUrl | null = null;
  private uploadService = inject(UploadService);
  imageUrl: string = '';
  activeStatusFilter: any;


  ngOnInit(): void {
    this.initForm();
    this.getCollectionsList();
  }

  private initForm(): void {
    this.collectionForm = this.fb.group({
      collectionTitle: ['', [Validators.required, Validators.minLength(3)]],
      collectionDescription: [''],
      collectionImage: [null]
    });
    this.vocabularyForm = this.fb.group({
      word: ['', [Validators.required, Validators.minLength(2)]],
      ipa: [''],
      pos: [''],
      collection_id: ['', [Validators.required]],
      meaning: ['', [Validators.required, Validators.minLength(5)]],
      example_sentence: ['']
    });
  }




  isFieldInvalid(fieldName: string): boolean {
    const control = this.vocabularyForm.get(fieldName);
    return !!(control && control.touched && control.invalid);
  }



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.spinner.show();
      const file = input.files[0];
      this.collectionForm.patchValue({ collectionImage: file });
      this.collectionForm.get('collectionImage')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
          this.spinner.hide();
          this.cdr.detectChanges();
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitCollectionForm(): void {
    if (this.collectionForm.invalid) {
      this.collectionForm.markAllAsTouched();
      return;
    }

    this.spinner.show();
    const imageFile = this.collectionForm.get('collectionImage')?.value;
    let user_login = this.getUserLogin();

    if (!user_login) {
      this.toastService.show('Vui lòng đăng nhập để thực hiện!', 'error');
      this.spinner.hide();
      return;
    }

    const upload$ = (imageFile instanceof File)
      ? this.uploadService.uploadImage(imageFile)
      : of({ url: this.imageUrl });

    upload$.pipe(
      concatMap((uploadRes) => {
        const payload: Collections = {
          user_id: user_login.user.id,
          title: this.collectionForm.get('collectionTitle')?.value,
          description: this.collectionForm.get('collectionDescription')?.value,
          cover_image: uploadRes.url || this.imageUrl,
          is_delete: "0",
          id: this.currentCollectionId() || undefined,
          created_at: undefined
        };

        return this.isEditMode()
          ? this.collectionsService.updateCollection(this.currentCollectionId()!, payload)
          : this.collectionsService.createCollection(payload);
      }),
      finalize(() => this.spinner.hide())
    ).subscribe({
      next: (res) => {
        this.toastService.show(res?.message || (this.isEditMode() ? 'Cập nhật thành công!' : 'Tạo thành công!'), 'success');
        this.closeCollectionModal();
        this.getCollectionsList();
      },
      error: (err) => {
        console.error(err);
        this.toastService.show(err?.error?.message || 'Có lỗi xảy ra!', 'error');
      }
    });
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

    if (this.vocabularyForm.invalid) {
      this.vocabularyForm.markAllAsTouched();
      return;
    }


    const payload: Vocabularies = {
      id: this.isEditMode() ? (this.currentvocabularyId() || undefined) : undefined,
      collection_id: Number(this.vocabularyForm.get('collection_id')?.value),
      word: this.vocabularyForm.get('word')?.value,
      pos: this.vocabularyForm.get('pos')?.value,
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
      ? this.vocabulariesService.updateVocabulary(payload.id!, payload) // DấugetVocabularies ! an toàn vì đã check editMode và payload.id
      : this.vocabulariesService.createVocabulary(payload);
    request$
      .pipe(
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
          // Hiển thị thông báo lỗi trả về từ Backend
          const errorMsg = err?.error?.message || 'Có lỗi xảy ra khi lưu từ vựng!';
          this.toastService.show(errorMsg, 'error');
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

  // 1. Lấy danh sách bộ sưu tập
  getCollectionsList(): void {
    this.spinner.show();
    this.collectionsService.getCollections().subscribe({
      next: (res) => {
        this.collectionsList.set(res.data || []);
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastService.show('Không thể tải danh sách bộ sưu tập', 'error');
      }
    });
  }

  // 2. Xóa bộ sưu tập
  onDeleteCollection(id: number): void {
    const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Xóa Bộ Sưu Tập',
        message: 'Bạn có chắc chắn muốn xóa bộ sưu tập này? Hành động này không thể hoàn tác.'
      }
    });

    dialogRef.afterClosed$.subscribe(result => {
      if (result) {
        this.spinner.show();
        this.collectionsService.deleteCollection(id).subscribe({
          next: () => {
            this.toastService.show('Đã xóa bộ sưu tập', 'success');
            this.getCollectionsList();
          },
          error: (err) => {
            this.spinner.hide();
            this.toastService.show('Lỗi khi xóa bộ sưu tập', 'error');
          }
        });
      } else if (result === false) {
        this.toastService.show('Đã hủy thao tác.', 'info');
      }
    });
  }

  // 3. Cập nhật bộ sưu tập (Mở modal edit)
  onEditCollection(collection: Collections): void {
    this.isEditMode.set(true);
    this.currentCollectionId.set(collection.id!);
    this.imageUrl = collection.cover_image || '';
    this.imagePreview = collection.cover_image || '';

    this.collectionForm.patchValue({
      collectionTitle: collection.title,
      collectionDescription: collection.description,
      collectionImage: null // Reset file input
    });

    this.showCollectionModal.set(true);
  }



  // Vocabulary actions
  getVocabularies(collectionId: number): void {
    this.spinner.show();
    this.vocabulariesService.getVocabulariesByCollectionId(collectionId).subscribe({
      next: (res) => {
        this.wordsList.set(res.data || []);
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastService.show('Không thể tải danh sách từ vựng', 'error');
      }
    });
  }

  onEditWord(vocabulary: Vocabularies) {
    this.isEditMode.set(true);
    this.currentvocabularyId.set(vocabulary.id!);
    this.vocabularyForm.patchValue({
      word: vocabulary.word,
      ipa: vocabulary.ipa,
      pos: vocabulary.pos,
      collection_id: vocabulary.collection_id,
      meaning: vocabulary.meaning,
      example_sentence: vocabulary.example_sentence
    })
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

  // Modal Stepper State
  importStep = signal<1 | 2 | 3>(1);

  collections = [
    {
      id: 1,
      title: 'Tiếng Anh Thương Mại (Mẫu)',
      description: 'Từ vựng cốt lõi cho các cuộc họp, đàm phán và email trong...',
      wordCount: 142,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'
    }
  ];

  words = []; // Keep old array for reference or remove if template is updated

  importedWords = [
    { stt: 1, target: 'Resilience', meaning: 'Khả năng phục hồi nhanh chóng', tags: ['IELTS'], status: 'Valid' },
    { stt: 2, target: 'Ephemeral', meaning: 'Phù du, chóng vánh', tags: ['GRE'], status: 'Valid' },
    { stt: 3, target: 'Ubiquitous', meaning: 'Có mặt ở khắp nơi', tags: ['GRE'], status: 'Duplicate' },
    { stt: 4, target: 'Pragmatic', meaning: '-- Thiếu định nghĩa --', tags: ['TOEFL'], status: 'Missing' },
    { stt: 5, target: 'Mitigate', meaning: 'Làm giảm nhẹ, làm dịu', tags: ['IELTS'], status: 'Valid' }
  ];

  openCollection(collectionId: number) {
    this.currentCollectionId.set(collectionId);
    this.getVocabularies(collectionId);
    this.currentView.set('words');
  }

  goBackToCollections() {
    this.currentView.set('collections');
  }

  openImportModal() {
    this.showImportModal.set(true);
    this.importStep.set(2);
  }

  closeImportModal() {
    this.showImportModal.set(false);
  }

  openCollectionModal() {
    this.isEditMode.set(false);
    this.currentCollectionId.set(null);
    this.imagePreview = null;
    this.imageUrl = '';
    this.collectionForm.reset();
    this.showCollectionModal.set(true);
  }

  closeCollectionModal() {
    this.showCollectionModal.set(false);
  }

  openVocabularyModal() {
    this.showVocabularyModal.set(true);
  }

  closeVocabularyModal() {
    this.showVocabularyModal.set(false);
  }




}
