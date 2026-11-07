import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/media/upload`;

    /**
     * Hàm upload file ảnh
     * @param file File cần upload
     * @returns Observable chứa URL ảnh từ server trả về
     */
    uploadImage(file: File): Observable<{ success: boolean; url: string }> {
        const formData = new FormData();
        formData.append('image', file); // 'image' phải trùng với key trong multer.single('image') ở Backend

        return this.http.post<{ success: boolean; url: string }>(this.API_URL, formData)
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse) {
        console.error('Lỗi upload:', error.message);
        return throwError(() => new Error('Không thể tải ảnh lên server, vui lòng thử lại sau.'));
    }
}