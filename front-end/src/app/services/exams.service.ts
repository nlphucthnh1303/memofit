import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Exams } from '../models/exams.model';

@Injectable({
    providedIn: 'root',
})
export class ExamsService {
    private baseApi = `${environment.apiUrl}/exams`;

    constructor(private http: HttpClient) { }

    getExams(): Observable<any> {
        return this.http.get<any>(this.baseApi);
    }

    getExam(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseApi}/${id}`);
    }

    createExam(data: Exams): Observable<any> {
        return this.http.post<any>(this.baseApi, data);
    }

    updateExam(id: number, data: Partial<Exams>): Observable<any> {
        return this.http.put<any>(`${this.baseApi}/${id}`, data);
    }

    deleteExam(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseApi}/${id}`);
    }
}
