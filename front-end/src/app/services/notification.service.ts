import { inject, Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Notification, NotificationType } from '../models/notification.model';

export interface DueReviewItem {
    vocabularyId: number;
    word: string;
    meaning: string;
    collectionTitle: string;
    intervalDays: number;
    easeFactor: number;
    nextReviewDate: string;
    status: string;
}

interface DueReviewResponse {
    success: boolean;
    total: number;
    data: DueReviewItem[];
}

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly http = inject(HttpClient);
    private readonly baseApi = `${environment.apiUrl}/notifications`;

    private readonly _notifications = signal<Notification[]>([]);

    readonly notifications = this._notifications.asReadonly();

    readonly unreadCount = computed(() =>
        this._notifications().filter((n) => !n.isRead).length
    );

    addNotification(
        title: string,
        message: string,
        type: NotificationType = NotificationType.SYSTEM,
        actionUrl?: string,
        vocabularyId?: number,
    ): void {
        const newNotification: Notification = {
            id: crypto.randomUUID(),
            title,
            message,
            type,
            isRead: false,
            createdAt: new Date(),
            actionUrl,
            vocabularyId,
        };

        this._notifications.update((list) => [newNotification, ...list]);
    }

    markAsRead(notificationId: string): void {
        this._notifications.update((list) =>
            list.map((n) =>
                n.id === notificationId ? { ...n, isRead: true } : n
            )
        );
    }

    markAllAsRead(): void {
        this._notifications.update((list) =>
            list.map((n) => ({ ...n, isRead: true }))
        );
    }

    removeNotification(notificationId: string): void {
        this._notifications.update((list) =>
            list.filter((n) => n.id !== notificationId)
        );
    }

    clearAll(): void {
        this._notifications.set([]);
    }

    fetchDueReviews(): void {
        this.http.get<DueReviewResponse>(`${this.baseApi}/due-reviews`).subscribe({
            next: (response) => {
                if (response.success && response.data.length > 0) {
                    this.checkAndNotifyDueReviews(response.data);
                }
            },
            error: (err) => {
                console.error('Lỗi khi lấy danh sách ôn tập:', err);
            },
        });
    }

    private checkAndNotifyDueReviews(dueItems: DueReviewItem[]): void {
        for (const item of dueItems) {
            const alreadyNotified = this._notifications().some(
                (n) =>
                    n.type === NotificationType.REVIEW_DUE &&
                    n.vocabularyId === item.vocabularyId &&
                    !n.isRead
            );

            if (!alreadyNotified) {
                this.addNotification(
                    `Đến giờ ôn tập: "${item.word}"`,
                    `Từ "${item.word}" trong bộ "${item.collectionTitle}" cần được ôn tập theo lịch SM-2.`,
                    NotificationType.REVIEW_DUE,
                    '/dashboard/practice',
                    item.vocabularyId
                );
            }
        }
    }
}
