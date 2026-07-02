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

    getExams(search?: string, sort?: string): Observable<any> {
        let params: any = {};
        if (search) params.search = search;
        if (sort) params.sort = sort;
        return this.http.get<any>(this.baseApi, { params });
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
