import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { UserVocabularyProgress } from '../models/user-vocabulary-progress.model';

@Injectable({
    providedIn: 'root',
})
export class UserVocabularyProgressService {
    private baseApi = `${environment.apiUrl}/user-vocabulary-progress`;

    constructor(private http: HttpClient) { }

    getUserVocabularyProgressList(): Observable<any> {
        return this.http.get<any>(this.baseApi);
    }

    getUserVocabularyProgress(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseApi}/${id}`);
    }

    createUserVocabularyProgress(data: UserVocabularyProgress): Observable<any> {
        return this.http.post<any>(this.baseApi, data);
    }

    updateUserVocabularyProgress(id: number, data: Partial<UserVocabularyProgress>): Observable<any> {
        return this.http.put<any>(`${this.baseApi}/${id}`, data);
    }

    deleteUserVocabularyProgress(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseApi}/${id}`);
    }
}
