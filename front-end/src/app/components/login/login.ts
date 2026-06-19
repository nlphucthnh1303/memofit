import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import { ToastService } from '../../shared/ui/toast/toast.service';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
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
  constructor() { }


  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.spinner.show();
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          localStorage.setItem('user-login', JSON.stringify(response));
          this.toastService.show('Đăng nhập thành công!', 'success');
          this.spinner.hide();
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error(err);
          const errorMessage = err.error?.message || 'Đăng nhập thất bại!';
          this.toastService.show(errorMessage, 'error');
          this.spinner.hide();
        }
      });
    }
  }
}
