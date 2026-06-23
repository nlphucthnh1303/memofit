import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Vocabularies } from '../models/vocabularies.model';

@Injectable({
    providedIn: 'root',
})
export class VocabulariesService {
    private baseApi = `${environment.apiUrl}/vocabularies`;

    constructor(private http: HttpClient) { }

    getVocabularies(): Observable<any> {
        return this.http.get<any>(this.baseApi);
    }

    getVocabulary(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseApi}/${id}`);
    }

    createVocabulary(data: Vocabularies | Vocabularies[]): Observable<any> {
        return this.http.post<any>(this.baseApi, data);
    }

    updateVocabulary(id: number, data: Partial<Vocabularies>): Observable<any> {
        return this.http.put<any>(`${this.baseApi}/${id}`, data);
    }

    deleteVocabulary(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseApi}/${id}`);
    }
}
