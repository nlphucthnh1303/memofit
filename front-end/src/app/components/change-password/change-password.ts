import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './change-password.html',
})
export class ChangePassword implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private spinner = inject(NgxSpinnerService);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  public emailReset: string = '';

  changePasswordForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const sessionData = sessionStorage.getItem('email_verify_otp');
      let parsed = null;

      if (sessionData) {
        try {
          parsed = JSON.parse(sessionData);
        } catch (e) {
          console.error(e);
        }
      }

      if (!parsed || !parsed.email || !parsed.is_forgot || !parsed.is_otp_verified) {
        this.toastService.show('Truy cập không hợp lệ!', 'error');
        this.router.navigate(['/login']);
        return;
      }

      this.emailReset = parsed.email;
      this.cdr.markForCheck();
    }
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      if (this.changePasswordForm.value.password !== this.changePasswordForm.value.confirmPassword) {
        this.changePasswordForm.get('confirmPassword')?.setErrors({ mismatch: true });
        this.toastService.show('Mật khẩu xác nhận không khớp!', 'error');
        return;
      }

      if (!this.emailReset) {
        this.toastService.show('Không tìm thấy email xác thực. Vui lòng thực hiện lại luồng!', 'error');
        this.router.navigate(['/login']);
        return;
      }

      this.spinner.show();
      this.authService.resetPassword({
        email: this.emailReset,
        password: this.changePasswordForm.value.password
      }).subscribe({
        next: (res) => {
          this.toastService.show(res.message || 'Mật khẩu đã được đặt lại thành công!', 'success');
          this.spinner.hide();
          this.changePasswordForm.reset();
          if (isPlatformBrowser(this.platformId)) {
            sessionStorage.removeItem('email_verify_otp');
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.toastService.show(err.error?.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu!', 'error');
          this.spinner.hide();
          this.cdr.markForCheck();
        }
      });
    }
  }
}