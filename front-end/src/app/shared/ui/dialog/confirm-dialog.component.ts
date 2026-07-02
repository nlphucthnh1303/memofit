import { Component, Inject, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from './dialog-core';

export type DialogType = 'success' | 'warning' | 'error' | 'info';

export interface ConfirmDialogData {
  title: string;
  message: string;
  type?: DialogType; // Mặc định là 'info' nếu không truyền
  confirmText?: string; // Tùy chỉnh text nút xác nhận
}

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