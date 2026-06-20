import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { error } from 'console';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private spinner = inject(NgxSpinnerService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.forgotForm.valid) {
      this.spinner.show();
      const emailValue = this.forgotForm.value.email;
      this.authService.sendForgotAuthOTP({ email: emailValue }).subscribe({
        next: (otpResponse) => {
          this.toastService.show('Yêu cầu quên mật khẩu thành công! Mã OTP đã được gửi đến email của bạn.', 'success');
          this.spinner.hide();
          sessionStorage.setItem('email_verify_otp', JSON.stringify({
            email: otpResponse.data.email,
            is_forgot: true
          }));
          this.router.navigate(['/otp']);
        },
        error: (err) => {
          console.error('Lỗi trong quá trình quên mật khẩu/gửi OTP:', err);
          const errorMsg = err.error?.message || 'Quá trình quên mật khẩu thất bại. Vui lòng thử lại!';
          this.toastService.show(errorMsg, 'error');
          this.spinner.hide();
        }
      });
    }
  }
}
