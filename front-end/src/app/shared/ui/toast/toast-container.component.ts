import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          role="alert"
          class="flex items-center gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto transition-all duration-300 animate-slide-in-right glass-card"
          [ngClass]="typeClasses[toast.type]"
        >
          <i class="text-xl fi" [ngClass]="iconClasses[toast.type]"></i>
          <p class="text-sm flex-1 font-bold text-slate-800">{{ toast.message }}</p>
          <button 
            type="button" 
            aria-label="Đóng"
            class="text-slate-400 hover:text-slate-600 transition-colors ml-2"
            (click)="toastService.remove(toast.id)"
          >
            <i class="fi fi-rr-cross"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
    }
    .animate-slide-in-right {
      animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideInRight {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    `
  ]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  typeClasses: Record<ToastType, string> = {
    success: 'border-l-4 border-l-emerald-500 border-y-slate-200 border-r-slate-200 border-t border-b border-r',
    error: 'border-l-4 border-l-red-500 border-y-slate-200 border-r-slate-200 border-t border-b border-r',
    warning: 'border-l-4 border-l-orange-500 border-y-slate-200 border-r-slate-200 border-t border-b border-r',
    info: 'border-l-4 border-l-blue-500 border-y-slate-200 border-r-slate-200 border-t border-b border-r'
  };

  iconClasses: Record<ToastType, string> = {
    success: 'fi-rr-check-circle text-emerald-500',
    error: 'fi-rr-cross-circle text-red-500',
    warning: 'fi-rr-triangle-warning text-orange-500',
    info: 'fi-rr-info text-blue-500'
  };
}
