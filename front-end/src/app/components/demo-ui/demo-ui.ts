import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from '../../shared/ui/alert/alert.component';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { DialogService } from '../../shared/ui/dialog/dialog.service';
import { DialogRef, DIALOG_DATA } from '../../shared/ui/dialog/dialog-core';

// --- Confirm Dialog Component ---
@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
      <div class="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
        <i class="fi fi-rr-trash"></i>
      </div>
      <div>
        <h3 class="text-lg font-bold text-slate-900">{{ data?.title || 'Xác nhận xóa' }}</h3>
      </div>
    </div>
    
    <div class="p-6">
      <p class="text-slate-600">{{ data?.message || 'Bạn có chắc chắn muốn thực hiện hành động này?' }}</p>
    </div>
    
    <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
      <button 
        class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
        (click)="dialogRef.close(false)"
      >
        Hủy bỏ
      </button>
      <button 
        class="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-sm"
        (click)="dialogRef.close(true)"
      >
        Xác nhận xóa
      </button>
    </div>
  `
})
export class ConfirmDialogComponent {
    dialogRef = inject(DialogRef);
    data = inject(DIALOG_DATA);
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
                message: 'Bạn sắp xóa toàn bộ danh sách 150 từ vựng. Hành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?'
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
