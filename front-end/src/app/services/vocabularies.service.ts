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

    getVocabulariesByCollectionId(collectionId: number): Observable<any> {
        return this.http.get<any>(`${this.baseApi}/collection/${collectionId}`);
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

    getVocabulariesDetailByCollectionId(collectionId: number): Observable<any> {
        return this.http.get<any>(`${this.baseApi}/detail/collection/${collectionId}}`);
    }

    getVocabularyDetail(vocabularyId: number): Observable<any> {
        return this.http.get<any>(`${this.baseApi}/detail/${vocabularyId}`);
    }

    downloadImportTemplate(): Observable<Blob> {
        return this.http.get(`${this.baseApi}/import/template`, {
            responseType: 'blob'
        });
    }

    previewImportTemplate(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(`${this.baseApi}/import/preview`, formData);
    }

    confirmImportTemplate(collectionId: number, userId: number, vocabularies: any[]): Observable<any> {
        return this.http.post<any>(`${this.baseApi}/import/confirm`, {
            collection_id: collectionId,
            user_id: userId,
            vocabularies: vocabularies
        });
    }

    getVocabulariesSearch(keyword: string = " ", limit: number = 10): Observable<any> {
        return this.http.get<any>(`${this.baseApi}/search/${keyword}/${limit}`);
    }
}
