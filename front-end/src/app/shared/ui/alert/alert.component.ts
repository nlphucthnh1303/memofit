import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!closed) {
      <div 
        role="alert" 
        class="flex items-start gap-4 p-4 rounded-xl border shadow-sm transition-all duration-300 relative"
        [ngClass]="typeClasses[type]"
      >
        <i class="mt-0.5 text-xl fi" [ngClass]="iconClasses[type]"></i>
        
        <div class="flex-1 pr-6">
          @if (title) {
            <p class="font-bold text-[15px]" [ngClass]="titleClasses[type]">{{ title }}</p>
          }
          <div class="text-[14px] leading-relaxed" [class.mt-1]="title" [ngClass]="contentClasses[type]">
            <ng-content></ng-content>
          </div>
        </div>

        @if (dismissible) {
          <button 
            type="button" 
            aria-label="Đóng"
            class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors bg-transparent border-none p-1 rounded-md"
            (click)="onClose()"
          >
            <i class="fi fi-rr-cross"></i>
          </button>
        }
      </div>
    }
  `
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() title = '';
  @Input() dismissible = true;
  @Output() close = new EventEmitter<void>();

  closed = false;

  typeClasses: Record<AlertType, string> = {
    success: 'bg-emerald-50/50 border-emerald-200',
    error: 'bg-red-50/50 border-red-200',
    warning: 'bg-orange-50/50 border-orange-200',
    info: 'bg-blue-50/50 border-blue-200'
  };

  iconClasses: Record<AlertType, string> = {
    success: 'fi-rr-check-circle text-emerald-600',
    error: 'fi-rr-cross-circle text-red-600',
    warning: 'fi-rr-triangle-warning text-orange-500',
    info: 'fi-rr-info text-blue-600'
  };

  titleClasses: Record<AlertType, string> = {
    success: 'text-emerald-800',
    error: 'text-red-800',
    warning: 'text-orange-800',
    info: 'text-blue-800'
  };

  contentClasses: Record<AlertType, string> = {
    success: 'text-emerald-700/90 font-medium',
    error: 'text-red-700/90 font-medium',
    warning: 'text-orange-700/90 font-medium',
    info: 'text-blue-700/90 font-medium'
  };

  onClose() {
    this.closed = true;
    this.close.emit();
  }
}
