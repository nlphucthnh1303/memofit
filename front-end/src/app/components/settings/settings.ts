import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';;
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from '../../shared/ui/dialog/dialog.service';
import { ConfirmDialogComponent } from '../demo-ui/demo-ui';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-settings',
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './settings.html',
})
export class Settings {
  private fb = inject(FormBuilder);
  private userRegister: any;
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialogService = inject(DialogService);
  logout() {
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
