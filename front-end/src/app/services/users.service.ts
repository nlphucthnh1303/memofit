import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Users } from '../models/users.model';
@Injectable({
    providedIn: 'root',
})


export class UsersService {
    private baseApi = `${environment.apiUrl}`;

    constructor(private http: HttpClient) { }

    getUsers(): Observable<any> {
        return this.http.get<any>(`${this.baseApi}/users`);
    }

    getUser(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseApi}/users/${id}`);
    }

    createUser(data: Users): Observable<any> {
        return this.http.post<any>(`${this.baseApi}/users`, data);
    }

    updateUser(data: Users, id: number): Observable<any> {
        return this.http.put<any>(`${this.baseApi}/users/${id}`, data);
    }
    updateOtpVerifyById(data: { isOtpVerify: boolean }, id: number): Observable<any> {
        return this.http.put<any>(`${this.baseApi}/users/${id}/otp-verify-id`, data);
    }
    updateOtpVerifyByEmail(data: { isOtpVerify: boolean }, email: string): Observable<any> {
        return this.http.put<any>(`${this.baseApi}/users/${email}/otp-verify-email`, data);
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseApi}/users/${id}`);
    }

    resetUserData(): Observable<any> {
        return this.http.post<any>(`${this.baseApi}/users/reset-data`, {});
    }
}
