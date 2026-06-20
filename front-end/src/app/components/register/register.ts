import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { response } from 'express';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private userRegister: any;
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private spinner = inject(NgxSpinnerService)
  constructor() { }

  registerForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    acceptTerms: [false, Validators.requiredTrue]
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.toastService.show('Vui lòng điền đầy đủ và chính xác thông tin đăng ký!', 'warning');
      return;
    }
    const { username, email, password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.toastService.show('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!', 'warning');
      return;
    }
    this.spinner.show();
    this.authService.register({ username, email, password })
      .pipe(
        switchMap((regResponse) => {
          this.userRegister = regResponse.data;
          console.log(regResponse.data)
          return this.authService.sendRegisterAuthOTP({ email: regResponse.data.email });
        })
      )
      .subscribe({
        next: (otpResponse) => {
          this.toastService.show('Đăng ký thành công! Mã OTP kích hoạt đã được gửi đến email của bạn.', 'success');
          this.spinner.hide();
          sessionStorage.setItem('email_verify_otp', JSON.stringify({
            email: otpResponse.data.email,
            is_forgot: false
          }));
          this.router.navigate(['/otp']);
        },
        error: (err) => {
          console.error('Lỗi trong quá trình đăng ký/gửi OTP:', err);
          const errorMsg = err.error?.message || 'Quá trình đăng ký thất bại. Vui lòng thử lại!';
          this.toastService.show(errorMsg, 'error');
          this.spinner.hide();
        }
      });
  }
}

