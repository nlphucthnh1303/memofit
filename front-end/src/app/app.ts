import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './shared/ui/toast/toast-container.component';
import { DialogHostComponent } from './shared/ui/dialog/dialog-host.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { NotificationService } from './services/notification.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, DialogHostComponent, NgxSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private notificationService = inject(NotificationService);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Tự động khởi động scheduler khi app load nếu user đã bật thông báo trước đó
    // Guard against SSR environment where localStorage is not available
    if (isPlatformBrowser(this.platformId)) {
      // 1) Tải thông báo NGAY khi mở app (không cần đợi đến giờ)
      this.notificationService.fetchOnStartup();
      // 2) Khởi động scheduler để nhắc theo giờ hàng ngày
      const notificationsEnabled = localStorage.getItem('notifications_enabled');
      if (notificationsEnabled !== 'false') {
        this.notificationService.startReminderScheduler();
      }
    }
  }
}
