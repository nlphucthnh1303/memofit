import { InjectionToken, Type } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface DialogConfig<D = any> {
  data?: D;
  width?: string;
  disableClose?: boolean;
}

export const DIALOG_DATA = new InjectionToken<any>('DialogData');

export class DialogRef<R = any> {
  private readonly _afterClosed = new Subject<R | undefined>();
  afterClosed$: Observable<R | undefined> = this._afterClosed.asObservable();
  
  id: string = Math.random().toString(36).substring(2, 9);
  
  constructor(private closeCallback: (id: string) => void) {}

  close(result?: R): void {
    this._afterClosed.next(result);
    this._afterClosed.complete();
    this.closeCallback(this.id);
  }
}

export interface DialogItem {
  id: string;
  component: Type<any>;
  config?: DialogConfig;
  dialogRef: DialogRef;
}
