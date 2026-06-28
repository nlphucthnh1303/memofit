import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from './dialog-core';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4">
      <h3 class="text-xl font-bold text-slate-900">{{ data.title }}</h3>
      <p class="text-slate-600 mb-2">{{ data.message }}</p>
      
      <div class="flex justify-end gap-3 mt-4">
        <button
          (click)="dialogRef.close(false)"
          class="px-5 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          {{ data.cancelText || 'Hủy' }}
        </button>
        <button
          (click)="dialogRef.close(true)"
          class="px-5 py-2.5 rounded-xl font-semibold text-white transition-colors"
          [ngClass]="data.isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'"
        >
          {{ data.confirmText || 'Xác nhận' }}
        </button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
