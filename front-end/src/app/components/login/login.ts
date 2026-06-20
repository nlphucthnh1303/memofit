import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import { ToastService } from '../../shared/ui/toast/toast.service';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private spinner = inject(NgxSpinnerService)
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  constructor() { }


  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.spinner.show();
      const { email, password, rememberMe } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          this.spinner.hide();
          this.toastService.show('Đăng nhập thành công!', 'success');

          if (isPlatformBrowser(this.platformId)) {
            const storage = rememberMe ? localStorage : sessionStorage;

            localStorage.setItem('storage_type', rememberMe ? 'local' : 'session');
            storage.setItem('user_login', JSON.stringify(response));

            const isVerified = response?.user?.isOtpVerify === true;
            storage.setItem('is_otp_verified', isVerified ? 'true' : 'false');

            if (isVerified) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/otp']);
            }
          }
        },
        error: (err) => {
          console.error(err);
          this.toastService.show(err.error?.message || 'Đăng nhập thất bại!', 'error');
          this.spinner.hide();
          this.cdr.markForCheck();
        }
      });
    }
  }
}
