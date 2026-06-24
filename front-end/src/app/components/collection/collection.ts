import { Component, ChangeDetectionStrategy, signal, inject, OnInit, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { CollectionsService } from '../../services/collections.service';
import { UploadService } from '../../services/upload.service';
import { DialogService } from '../../shared/ui/dialog/dialog.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfirmDialogComponent } from '../demo-ui/demo-ui';
import { Collections } from '../../models/collections.model';
import { concatMap, finalize, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './collection.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Collection implements OnInit {
  collectionsList = signal<Collections[]>([]);
  showCollectionModal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  currentCollectionId = signal<number | null>(null);

  imagePreview: string | SafeUrl | null = null;
  imageUrl: string = '';
  collectionForm!: FormGroup;

  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);
  private fb = inject(FormBuilder);
  private spinner = inject(NgxSpinnerService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);
  private collectionsService = inject(CollectionsService);
  private uploadService = inject(UploadService);
  private router = inject(Router);

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

  openCollection(collectionId: number) {
    this.router.navigate(['/dashboard/vocabulary', collectionId]);
  }

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

  onDeleteCollection(id: number): void {
    const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
      width: '450px',
      data: { title: 'Xóa Bộ Sưu Tập', message: 'Bạn có chắc chắn muốn xóa bộ sưu tập này? Hành động này không thể hoàn tác.' }
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

  onEditCollection(collection: Collections): void {
    this.isEditMode.set(true);
    this.currentCollectionId.set(collection.id!);
    this.imageUrl = collection.cover_image || '';
    this.imagePreview = collection.cover_image || '';
    this.collectionForm.patchValue({
      collectionTitle: collection.title,
      collectionDescription: collection.description,
      collectionImage: null
    });
    this.showCollectionModal.set(true);
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

    const upload$ = (imageFile instanceof File) ? this.uploadService.uploadImage(imageFile) : of({ url: this.imageUrl });

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
        return this.isEditMode() ? this.collectionsService.updateCollection(this.currentCollectionId()!, payload) : this.collectionsService.createCollection(payload);
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
}
