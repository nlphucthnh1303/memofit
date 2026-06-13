import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { AuthencationOtp } from './components/authencation-otp/authencation-otp';
import { ChangePassword } from './components/change-password/change-password';
import { Dashboard } from './components/dashboard/dashboard';
import { Settings } from './components/settings/settings';
import { Vocabulary } from './components/vocabulary/vocabulary';
import { GenerateQuestions } from './components/generate-questions/generate-questions';
import { Practice } from './components/practice/practice';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'otp', component: AuthencationOtp },
  { path: 'change-password', component: ChangePassword },
  { path: 'dashboard', component: Dashboard },
  { path: 'settings', component: Settings },
  { path: 'vocabulary', component: Vocabulary },
  { path: 'generate-questions', component: GenerateQuestions },
  { path: 'practice', component: Practice }
];
