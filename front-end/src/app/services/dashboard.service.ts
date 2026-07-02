import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { DashboardResponse } from '../models/dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {


    private baseApi = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) { }

    getDashboardOverview(): Observable<DashboardResponse> {
        return this.http.get<DashboardResponse>(`${this.baseApi}/overview`);
    }
}