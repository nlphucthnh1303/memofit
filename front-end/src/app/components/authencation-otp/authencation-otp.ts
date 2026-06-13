import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-authencation-otp',
  imports: [ReactiveFormsModule],
  templateUrl: './authencation-otp.html',
})
export class AuthencationOtp {
  private fb = inject(FormBuilder);
  
  otpForm: FormGroup = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  onSubmit() {
    if (this.otpForm.valid) {
      console.log(this.otpForm.value);
    }
  }
}
