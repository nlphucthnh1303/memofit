import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { QuizResults } from '../models/quiz-results.model';

@Injectable({
    providedIn: 'root',
})
export class QuizResultsService {
    private baseApi = `${environment.apiUrl}/quiz-results`;

    constructor(private http: HttpClient) { }

    getQuizResults(): Observable<any> {
        return this.http.get<any>(this.baseApi);
    }

    getQuizResult(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseApi}/${id}`);
    }

    createQuizResult(data: QuizResults): Observable<any> {
        return this.http.post<any>(this.baseApi, data);
    }

    updateQuizResult(id: number, data: Partial<QuizResults>): Observable<any> {
        return this.http.put<any>(`${this.baseApi}/${id}`, data);
    }

    deleteQuizResult(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseApi}/${id}`);
    }
}
