import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseApi = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  register(data: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseApi}/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseApi}/login`, data);
  }

  sendRegisterAuthOTP(data: { email: string }): Observable<any> {
    return this.http.post<any>(`${this.baseApi}/send-register-otp`, data);
  }

  sendForgotAuthOTP(data: { email: string }): Observable<any> {
    return this.http.post<any>(`${this.baseApi}/send-forgot-otp`, data);
  }

  verifyOtp(data: { email: string; otp: string, type: string }): Observable<any> {
    return this.http.post<any>(`${this.baseApi}/verify-otp`, data);
  }

  resetPassword(data: { email: string; otp: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseApi}/reset-password`, data);
  }

}
