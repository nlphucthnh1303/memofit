import { Injectable, Type, signal } from '@angular/core';
import { DialogConfig, DialogRef, DialogItem } from './dialog-core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogsSignal = signal<DialogItem[]>([]);
  public dialogs = this.dialogsSignal.asReadonly();

  open<T>(component: Type<T>, config?: DialogConfig): DialogRef {
    const dialogRef = new DialogRef((id) => this.removeDialog(id));

    const newDialog: DialogItem = {
      id: dialogRef.id,
      component,
      config,
      dialogRef
    };

    this.dialogsSignal.update(dialogs => [...dialogs, newDialog]);

    return dialogRef;
  }

  private removeDialog(id: string) {
    this.dialogsSignal.update(dialogs => dialogs.filter(d => d.id !== id));
  }
}
