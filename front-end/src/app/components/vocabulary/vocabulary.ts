import { Component, ChangeDetectionStrategy, signal, inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { CollectionsService } from '../../services/collections.service';
import { UploadService } from '../../services/upload.service';
import { concatMap, finalize, of } from 'rxjs'
import { Collections } from '../../models/collections.model';
import { DialogService } from '../../shared/ui/dialog/dialog.service';
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
  activeStatusFilter = signal<'ALL' | 'MASTERED' | 'REVIEW_SOON'>('ALL');
  collectionsList = signal<Collections[]>([]);
  isEditMode = signal<boolean>(false);
  currentCollectionId = signal<number | null>(null);

  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private spinner = inject(NgxSpinnerService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);
  private collectionsService = inject(CollectionsService);
  collectionForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  private uploadService = inject(UploadService);
  imageUrl: string = '';
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
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.collectionForm.patchValue({ collectionImage: file });
      this.collectionForm.get('collectionImage')?.updateValueAndValidity();
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result;
        this.spinner.hide()
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
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
    if (window.confirm('Bạn có chắc chắn muốn xóa bộ sưu tập này? Hành động này không thể hoàn tác.')) {
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
    }
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

  words = [
    {
      id: 1,
      target: 'Ubiquitous',
      ipa: '/juːˈbɪk.wɪ.təs/',
      type: 'Adj',
      meaning: 'Có mặt ở khắp mọi nơi; phổ biến.',
      example: '"Mobile phones have become ubiquitous in our daily lives."',
      status: 'Mastered', // Mastered, Learning, Review Soon
      nextReview: '14 days',
      progress: 4 // out of 4
    },
    {
      id: 2,
      target: 'Ephemeral',
      ipa: '/ɪˈfem.ər.əl/',
      type: 'Adj',
      meaning: 'Phù du, chóng tàn, tồn tại trong thời gian ngắn.',
      example: '"Fame in the world of rock and pop is largely ephemeral."',
      status: 'Learning',
      nextReview: 'Tomorrow',
      progress: 2
    },
    {
      id: 3,
      target: 'Ephemeral',
      ipa: '/ɪˈfem.ər.əl/',
      type: 'Adj',
      meaning: 'Phù du, chóng tàn, tồn tại trong thời gian ngắn.',
      example: '"Fame in the world of rock and pop is largely ephemeral."',
      status: 'Learning',
      nextReview: 'Tomorrow',
      progress: 2
    },
    {
      id: 4,
      target: 'Ephemeral',
      ipa: '/ɪˈfem.ər.əl/',
      type: 'Adj',
      meaning: 'Phù du, chóng tàn, tồn tại trong thời gian ngắn.',
      example: '"Fame in the world of rock and pop is largely ephemeral."',
      status: 'Learning',
      nextReview: 'Tomorrow',
      progress: 2
    },
    {
      id: 5,
      target: 'Ephemeral',
      ipa: '/ɪˈfem.ər.əl/',
      type: 'Adj',
      meaning: 'Phù du, chóng tàn, tồn tại trong thời gian ngắn.',
      example: '"Fame in the world of rock and pop is largely ephemeral."',
      status: 'Learning',
      nextReview: 'Tomorrow',
      progress: 2
    },
    {
      id: 6,
      target: 'Mitigate',
      ipa: '/ˈmɪt.ɪ.ɡeɪt/',
      type: 'Verb',
      meaning: 'Làm giảm nhẹ, làm dịu bớt (tác hại, cơn đau).',
      example: '"It is unclear how to mitigate the effects of tourism on the island."',
      status: 'Review Soon',
      nextReview: 'Today',
      progress: 1
    }
  ];

  importedWords = [
    { stt: 1, target: 'Resilience', meaning: 'Khả năng phục hồi nhanh chóng', tags: ['IELTS'], status: 'Valid' },
    { stt: 2, target: 'Ephemeral', meaning: 'Phù du, chóng vánh', tags: ['GRE'], status: 'Valid' },
    { stt: 3, target: 'Ubiquitous', meaning: 'Có mặt ở khắp nơi', tags: ['GRE'], status: 'Duplicate' },
    { stt: 4, target: 'Pragmatic', meaning: '-- Thiếu định nghĩa --', tags: ['TOEFL'], status: 'Missing' },
    { stt: 5, target: 'Mitigate', meaning: 'Làm giảm nhẹ, làm dịu', tags: ['IELTS'], status: 'Valid' }
  ];

  openCollection() {
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
