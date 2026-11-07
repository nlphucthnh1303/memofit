import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Collections } from '../models/collections.model';

@Injectable({
    providedIn: 'root',
})
export class CollectionsService {
    private baseApi = `${environment.apiUrl}/collections`;

    constructor(private http: HttpClient) { }

    getCollections(search?: string, sort?: string): Observable<any> {
        let params: any = {};
        if (search) params.search = search;
        if (sort) params.sort = sort;
        return this.http.get<any>(this.baseApi, { params });
    }

    getCollection(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseApi}/${id}`);
    }

    createCollection(data: Collections): Observable<any> {
        return this.http.post<any>(this.baseApi, data);
    }

    updateCollection(id: number, data: Partial<Collections>): Observable<any> {
        return this.http.put<any>(`${this.baseApi}/${id}`, data);
    }

    deleteCollection(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseApi}/${id}`);
    }
}
