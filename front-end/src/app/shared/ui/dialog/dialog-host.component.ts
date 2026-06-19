import { Component, HostListener, Injector, OnInit, inject } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { DialogService } from './dialog.service';
import { DialogRef, DialogItem, DIALOG_DATA } from './dialog-core';

@Component({
  selector: 'app-dialog-host',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  template: `
    @for (dialog of dialogService.dialogs(); track dialog.id) {
      <div 
        class="fixed inset-0 z-[9990] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        role="dialog"
        aria-modal="true"
        (click)="onBackdropClick($event, dialog)"
      >
        <div 
          class="bg-white rounded-2xl shadow-2xl relative overflow-hidden flex flex-col animate-scale-in"
          [style.width]="dialog.config?.width || 'auto'"
          (click)="$event.stopPropagation()"
        >
           <ng-container *ngComponentOutlet="dialog.component; injector: createInjector(dialog)"></ng-container>
        </div>
      </div>
    }
  `,
  styles: [
    `
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out forwards;
    }
    .animate-scale-in {
      animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    `
  ]
})
export class DialogHostComponent {
  dialogService = inject(DialogService);
  private parentInjector = inject(Injector);

  @HostListener('document:keydown.escape')
  handleKeyDown() {
    const dialogs = this.dialogService.dialogs();
    if (dialogs.length > 0) {
      const topDialog = dialogs[dialogs.length - 1];
      if (!topDialog.config?.disableClose) {
        topDialog.dialogRef.close();
      }
    }
  }

  createInjector(dialog: DialogItem): Injector {
    return Injector.create({
      parent: this.parentInjector,
      providers: [
        { provide: DialogRef, useValue: dialog.dialogRef },
        { provide: DIALOG_DATA, useValue: dialog.config?.data || null }
      ]
    });
  }

  onBackdropClick(event: MouseEvent, dialog: DialogItem) {
    if (dialog.config?.disableClose) return;
    dialog.dialogRef.close();
  }
}
