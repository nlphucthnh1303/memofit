import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './shared/ui/toast/toast-container.component';
import { DialogHostComponent } from './shared/ui/dialog/dialog-host.component';
import { NgxSpinnerModule } from "ngx-spinner";
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, DialogHostComponent, NgxSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { }
