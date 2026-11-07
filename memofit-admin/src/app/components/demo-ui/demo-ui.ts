import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from '../../shared/ui/alert/alert.component';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { DialogService } from '../../shared/ui/dialog/dialog.service';
import { DialogRef, DIALOG_DATA } from '../../shared/ui/dialog/dialog-core';
import { ConfirmDialogData } from '../../shared/ui/dialog/confirm-dialog.component';

// --- Confirm Dialog Component ---
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
      <div [class]="'w-10 h-10 rounded-full flex items-center justify-center shrink-0 ' + getTheme().bg">
        <i [class]="'fi ' + getTheme().icon"></i>
      </div>
      <div>
        <h3 class="text-lg font-bold text-slate-900">{{ data.title }}</h3>
      </div>
    </div>
    
    <div class="p-6">
      <p class="text-slate-600">{{ data.message }}</p>
    </div>
    
    <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
      <button 
        class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
        (click)="dialogRef.close(false)"
      >
        Hủy bỏ
      </button>
      <button 
        [class]="'px-5 py-2.5 rounded-xl text-white font-semibold transition-colors shadow-sm ' + getTheme().btn"
        (click)="dialogRef.close(true)"
      >
        {{ data.confirmText || 'Xác nhận' }}
      </button>
    </div>
  `
})
export class ConfirmDialogComponent {
  dialogRef = inject(DialogRef);
  data = inject<ConfirmDialogData>(DIALOG_DATA);

  getTheme() {
    const type = this.data?.type || 'info';
    const themes = {
      success: { bg: 'bg-green-50 text-green-600', icon: 'fi-rr-check', btn: 'bg-green-600 hover:bg-green-700' },
      warning: { bg: 'bg-amber-50 text-amber-600', icon: 'fi-rr-warning', btn: 'bg-amber-600 hover:bg-amber-700' },
      error: { bg: 'bg-red-50 text-red-600', icon: 'fi-rr-trash', btn: 'bg-red-600 hover:bg-red-700' },
      info: { bg: 'bg-blue-50 text-blue-600', icon: 'fi-rr-info', btn: 'bg-blue-600 hover:bg-blue-700' }
    };
    return themes[type];
  }
}

// --- Main Demo Component ---
@Component({
  selector: 'app-demo-ui',
  standalone: true,
  imports: [CommonModule, AlertComponent, ReactiveFormsModule],
  templateUrl: './demo-ui.html'
})
export class DemoUi {
  toastService = inject(ToastService);
  dialogService = inject(DialogService);

  showToast(type: 'success' | 'error' | 'warning' | 'info') {
    const messages = {
      success: 'Đã lưu thiết lập thành công!',
      error: 'Xóa dữ liệu thất bại, vui lòng thử lại sau.',
      warning: 'Phiên đăng nhập sắp hết hạn.',
      info: 'Đồng bộ hóa dữ liệu hoàn tất lúc 10:45 AM.'
    };

    this.toastService.show(messages[type], type);
  }

  showCustomToast(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.toastService.show(message, type);
  }

  openDialog() {
    const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Xóa tài liệu',
        message: 'Bạn sắp xóa toàn bộ danh sách 150 từ vựng. Hành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?',
        type: 'error',
        confirmText: 'Xóa ngay'
      }
    });

    dialogRef.afterClosed$.subscribe(result => {
      if (result) {
        this.toastService.show('Đã xóa bộ từ vựng thành công!', 'success');
      } else if (result === false) {
        this.toastService.show('Đã hủy thao tác.', 'info');
      }
    });
  }
}
