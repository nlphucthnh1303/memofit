import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from '../../shared/ui/dialog/dialog.service';
import { ConfirmDialogComponent } from '../demo-ui/demo-ui';
import { NotificationService } from '../../services/notification.service';
import { UsersService } from '../../services/users.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-settings',
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './settings.html',
})
export class Settings implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private dialogService = inject(DialogService);
  private spinner = inject(NgxSpinnerService);
  private notificationService = inject(NotificationService);

  notificationsEnabled = signal<boolean>(true);
  reminderTime = signal<string>('08:00');

  ngOnInit(): void {
    const savedNotify = localStorage.getItem('notifications_enabled');
    if (savedNotify !== null) {
      this.notificationsEnabled.set(savedNotify === 'true');
    }
    const savedTime = localStorage.getItem('reminder_time');
    if (savedTime !== null) {
      this.reminderTime.set(savedTime);
    }
  }

  toggleNotifications(): void {
    const newVal = !this.notificationsEnabled();
    this.notificationsEnabled.set(newVal);
    localStorage.setItem('notifications_enabled', String(newVal));

    if (newVal) {
      this.notificationService.fetchDueReviews();
      this.toastService.show('Đã bật thông báo hệ thống', 'success');
    } else {
      this.notificationService.clearAll();
      this.toastService.show('Đã tắt nhận thông báo', 'info');
    }
  }

  saveReminderTime(timeValue: string): void {
    this.reminderTime.set(timeValue);
    localStorage.setItem('reminder_time', timeValue);
    this.toastService.show(`Thời gian ôn tập đã đặt thành ${timeValue}`, 'success');
  }

  resetUserData(): void {
    const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Thiết Lập Lại Ứng Dụng',
        message: 'Bạn có chắc chắn muốn xóa toàn bộ lịch sử học tập, danh sách từ vựng và khoảng cách SM-2? Hành động này không thể hoàn tác!',
        type: 'error',
        confirmText: 'Xóa dữ liệu'
      }
    });

    dialogRef.afterClosed$.subscribe(result => {
      if (result) {
        this.spinner.show();
        this.usersService.resetUserData().subscribe({
          next: (res) => {
            this.spinner.hide();
            this.notificationService.clearAll();
            this.toastService.show(res.message || 'Thiết lập lại dữ liệu thành công!', 'success');
          },
          error: (err) => {
            this.spinner.hide();
            this.toastService.show(err.error?.message || 'Có lỗi xảy ra khi xóa dữ liệu!', 'error');
          }
        });
      } else if (result === false) {
        this.toastService.show('Đã hủy thao tác.', 'info');
      }
    });
  }

  logout(): void {
    const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Đăng Xuất',
        message: 'Bạn có chắc chắn muốn đăng xuất? Dữ liệu đăng nhập sẽ bị xóa !',
        type: 'info',
        confirmText: 'Đăng Xuất'
      }
    });

    dialogRef.afterClosed$.subscribe(result => {
      if (result) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('storage_type');
        localStorage.removeItem('user_login');
        sessionStorage.removeItem('user_login');
        this.toastService.show('Đăng Xuất Thành Công', 'success');
        this.router.navigate(['/login']);
      } else if (result === false) {
        this.toastService.show('Đã hủy thao tác.', 'info');
      }
    });
  }
}
