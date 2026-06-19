import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal, PLATFORM_ID } from '@angular/core'; // BỔ SUNG: PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // BỔ SUNG: isPlatformBrowser
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-authencation-otp',
  imports: [ReactiveFormsModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './authencation-otp.html',
})
export class AuthencationOtp implements OnInit {
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);
  public emailSend!: string;
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private spinner = inject(NgxSpinnerService);

  private platformId = inject(PLATFORM_ID);

  countdown = signal<number>(180);
  canReset = signal<boolean>(false);
  private timerSubscription!: Subscription;

  otpForm: FormGroup = this.fb.group({
    otp1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    otp2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    otp3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
    otp4: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
  });
  constructor() { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.emailSend = sessionStorage.getItem('email_verify_otp') || '';

      if (!this.emailSend || this.emailSend === '') {
        this.toastService.show('Email không tồn tại!', 'error');
        // Tránh lỗi bất đồng bộ của OnPush, báo Angular cập nhật lại giao diện
        this.cdr.markForCheck();
        return;
      }

      // Chạy bộ đếm lùi
      this.startCountdown();
      this.cdr.markForCheck();
    }
  }

  startCountdown() {
    this.countdown.set(180);
    this.canReset.set(false);

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.countdown() > 0))
      .subscribe(() => {
        this.countdown.update(prev => prev - 1);

        if (this.countdown() === 0) {
          this.canReset.set(true);
        }
        this.cdr.markForCheck(); // Đảm bảo OnPush bắt được sự thay đổi của giây
      });
  }

  onSubmit() {
    if (this.otpForm.valid) {
      let otp: string = '';
      const valuesArray = Object.values(this.otpForm.value);
      otp = valuesArray.join('');
      if (!this.emailSend || this.emailSend == '') {
        this.toastService.show('Email không tồn tại!', 'error');
        return;
      }
      this.authService.verifyOtp({ email: this.emailSend, otp: otp, type: "REGISTER" })
        .pipe(
          switchMap((res) => {
            this.toastService.show(res.message, 'success');
            const updateData = { isOtpVerify: true } as { isOtpVerify: boolean };
            return this.usersService.updateOtpVerifyByEmail(updateData, this.emailSend);
          })
        )
        .subscribe({
          next: () => {
            // ĐỪNG QUÊN: Xóa email rác sau khi xác thực thành công
            if (isPlatformBrowser(this.platformId)) {
              sessionStorage.removeItem('email_verify_otp');
            }
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.log(err);
            this.toastService.show(err.error?.message || 'Đã có lỗi xảy ra!', 'error');
            this.cdr.markForCheck();
          }
        });
    }
  }

  userId(userId: any): number {
    throw new Error('Method not implemented.');
  }

  onResendOtp() {
    // SỬA LỖI TRƯỚC: canReset là signal nên phải gọi dạng hàm this.canReset()
    if (!this.canReset()) return;

    this.spinner.show();
    this.authService.sendRegisterAuthOTP({ email: this.emailSend }).subscribe({
      next: (res) => {
        this.toastService.show(res?.message || 'Mã OTP mới đã được gửi lại thành công vào hòm thư!', 'success');
        this.startCountdown();
        this.spinner.hide();
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Không thể gửi lại mã OTP lúc này. Vui lòng thử lại sau!', 'error');
        this.spinner.hide();
        this.cdr.markForCheck();
      }
    });
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '03:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    const strSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    return `${strMinutes}:${strSeconds}`;
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}