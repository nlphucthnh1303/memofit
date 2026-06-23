import { Component, ChangeDetectionStrategy, signal, inject, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { CollectionsService } from '../../services/collections.service';
import { UploadService } from '../../services/upload.service';
import { concatMap, of } from 'rxjs'
import { Collections } from '../../models/collections.model';
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
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private spinner = inject(NgxSpinnerService);
  private toastService = inject(ToastService);
  private collectionsService = inject(CollectionsService);
  collectionForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  private uploadService = inject(UploadService);
  imageUrl: string = '';
  ngOnInit(): void {
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
    this.spinner.show()
    if (this.collectionForm.invalid) {
      this.collectionForm.markAllAsTouched();
      this.spinner.hide()
      return;
    }
    const imageFile = this.collectionForm.get('collectionImage')?.value;
    let user_login = null;

    const storageType = localStorage.getItem('storage_type');
    const storage = storageType === 'session' ? sessionStorage : localStorage;
    const userLoginStr = storage.getItem('user_login');
    console.log(localStorage.getItem('user_login'));
    if (userLoginStr) {
      try {
        user_login = JSON.parse(userLoginStr);
      } catch (e) {
        console.error('Dữ liệu user_login trong storage bị lỗi định dạng JSON:', e);

      }
    }

    (imageFile ? this.uploadService.uploadImage(imageFile) : of({ url: '' }))
      .pipe(
        concatMap((uploadRes) => {
          const payload: Collections = {
            "user_id": user_login.user.id,
            "title": this.collectionForm.get('collectionTitle')?.value,
            "description": this.collectionForm.get('collectionDescription')?.value,
            "cover_image": uploadRes.url,
            "is_delete": "0",
            "id": undefined,
            "created_at": undefined
          };

          return this.collectionsService.createCollection(payload);
        })
      )
      .subscribe({
        next: (res) => {
          console.log('Bộ từ vựng đã được tạo thành công!', res);
          this.toastService.show(res?.message || 'Tạo thành công!', 'success');
          this.spinner.hide();
        },
        error: (err) => {
          console.error(err);
          this.toastService.show(err?.error.message || 'Có lỗi xảy ra!', 'error');
        }
      });
  }







  // Modal Stepper State
  importStep = signal<1 | 2 | 3>(1);

  collections = [
    {
      id: 1,
      title: 'Tiếng Anh Thương Mại',
      description: 'Từ vựng cốt lõi cho các cuộc họp, đàm phán và email trong...',
      wordCount: 142,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Thuật ngữ IT & Lập trình',
      description: 'Tập hợp các khái niệm lập trình, kiến trúc hệ thống và từ vựng...',
      wordCount: 350,
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2370&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Giao tiếp Hàng ngày',
      description: 'Các mẫu câu và từ vựng thông dụng để sinh tồn và giao tiếp tự nhiên trong cuộc sống thường...',
      wordCount: 89,
      imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2370&auto=format&fit=crop'
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
