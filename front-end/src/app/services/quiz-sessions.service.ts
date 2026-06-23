import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { QuizSessions } from '../models/quiz-sessions.model';

@Injectable({
    providedIn: 'root',
})
export class QuizSessionsService {
    private baseApi = `${environment.apiUrl}/quiz-sessions`;

    constructor(private http: HttpClient) { }

    getQuizSessions(): Observable<any> {
        return this.http.get<any>(this.baseApi);
    }

    getQuizSession(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseApi}/${id}`);
    }

    createQuizSession(data: QuizSessions): Observable<any> {
        return this.http.post<any>(this.baseApi, data);
    }

    updateQuizSession(id: number, data: Partial<QuizSessions>): Observable<any> {
        return this.http.put<any>(`${this.baseApi}/${id}`, data);
    }

    deleteQuizSession(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseApi}/${id}`);
    }
}
