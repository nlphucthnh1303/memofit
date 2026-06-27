import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Questions } from '../models/questions.model';

@Injectable({
    providedIn: 'root',
})
export class QuestionsService {
    private baseApi = `${environment.apiUrl}/questions`;

    constructor(private http: HttpClient) { }

    getQuestions(): Observable<any> {
        return this.http.get<any>(this.baseApi);
    }

    getQuestion(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseApi}/${id}`);
    }

    createQuestion(data: Questions): Observable<any> {
        return this.http.post<any>(this.baseApi, data);
    }

    updateQuestion(id: number, data: Partial<Questions>): Observable<any> {
        return this.http.put<any>(`${this.baseApi}/${id}`, data);
    }

    deleteQuestion(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseApi}/${id}`);
    }

    generateAiQuestions(vocabularyList: any[], config: any): Observable<any> {
        return this.http.post<any>(`${this.baseApi}/generate-ai`, {
            vocabulary_list: vocabularyList,
            config: config
        });
    }

    createMultipleQuestions(data: Questions[]): Observable<any> {
        return this.http.post<any>(`${this.baseApi}/multiple`, data);
    }
}
