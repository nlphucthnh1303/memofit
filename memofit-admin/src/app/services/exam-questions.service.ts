import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ExamQuestions } from '../models/exam-questions.model';

@Injectable({
    providedIn: 'root',
})
export class ExamQuestionsService {
    private baseApi = `${environment.apiUrl}/exam-questions`;

    constructor(private http: HttpClient) { }

    getExamQuestions(): Observable<any> {
        return this.http.get<any>(this.baseApi);
    }

    getExamQuestion(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseApi}/${id}`);
    }

    createExamQuestion(data: ExamQuestions): Observable<any> {
        return this.http.post<any>(this.baseApi, data);
    }

    createExamQuestions(data: ExamQuestions[]): Observable<any> {
        return this.http.post<any>(`${this.baseApi}/multiple`, data);
    }

    updateExamQuestion(id: number, data: Partial<ExamQuestions>): Observable<any> {
        return this.http.put<any>(`${this.baseApi}/${id}`, data);
    }

    deleteExamQuestion(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseApi}/${id}`);
    }
}
