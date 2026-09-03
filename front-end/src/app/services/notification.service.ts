import { inject, Injectable, computed, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
    private readonly platformId = inject(PLATFORM_ID);
    private readonly baseApi = `${environment.apiUrl}/notifications`;

    private readonly _notifications = signal<Notification[]>([]);
    private schedulerIntervalId: ReturnType<typeof setInterval> | null = null;
    private lastNotifiedDate: string | null = null;

    readonly notifications = this._notifications.asReadonly();

    readonly unreadCount = computed(() =>
        this._notifications().filter((n) => !n.isRead).length
    );

    // ─── Helper: an toàn khi đọc localStorage (tránh crash SSR) ──────────────
    private getStorage(key: string): string | null {
        if (!isPlatformBrowser(this.platformId)) return null;
        return localStorage.getItem(key);
    }

    private setStorage(key: string, value: string): void {
        if (!isPlatformBrowser(this.platformId)) return;
        localStorage.setItem(key, value);
    }
    // ─────────────────────────────────────────────────────────────────────────

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
        // Không chạy khi SSR hoặc chưa đăng nhập
        if (!isPlatformBrowser(this.platformId)) return;

        const token = this.getStorage('access_token');
        if (!token) {
            console.log('[NotificationService] Bỏ qua fetch: chưa đăng nhập.');
            return;
        }

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

    /**
     * Tải thông báo ôn tập ngay khi khởi động (không cần đợi đến giờ hẹn).
     * Gọi hàm này sau khi đăng nhập thành công.
     */
    fetchOnStartup(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        // Đảm bảo defaults đã có trong localStorage
        if (this.getStorage('notifications_enabled') === null) {
            this.setStorage('notifications_enabled', 'true');
        }
        if (this.getStorage('reminder_time') === null) {
            this.setStorage('reminder_time', '08:00');
        }

        const enabled = this.getStorage('notifications_enabled');
        if (enabled !== 'false') {
            console.log('[NotificationService] Tải thông báo khi khởi động...');
            this.fetchDueReviews();
        }
    }

    /**
     * Khởi động scheduler kiểm tra mỗi phút xem có đến giờ nhắc nhở chưa.
     * Mỗi ngày chỉ gửi thông báo 1 lần vào đúng giờ đã cài (reminderTime).
     */
    startReminderScheduler(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.stopReminderScheduler(); // clear interval cũ nếu có

        const check = () => {
            // Coi null (chưa cài) = bật thông báo (mặc định)
            const notificationsEnabled = this.getStorage('notifications_enabled');
            if (notificationsEnabled === 'false') return;

            const reminderTime = this.getStorage('reminder_time') ?? '08:00';

            const now = new Date();
            const [targetHour, targetMinute] = reminderTime.split(':').map(Number);
            const todayKey = now.toDateString();

            // Kiểm tra trong window ±1 phút so với giờ đặt và chưa notify hôm nay
            const nowTotalMinutes = now.getHours() * 60 + now.getMinutes();
            const targetTotalMinutes = targetHour * 60 + targetMinute;
            const diff = Math.abs(nowTotalMinutes - targetTotalMinutes);

            if (diff <= 1 && this.lastNotifiedDate !== todayKey) {
                this.lastNotifiedDate = todayKey;
                this.fetchDueReviews();
                console.log(`[NotificationService] Đã kích hoạt nhắc nhở lúc ${reminderTime}`);
            }
        };

        // Kiểm tra mỗi 1 phút (60,000ms)
        this.schedulerIntervalId = setInterval(check, 60_000);
        console.log('[NotificationService] Scheduler đã khởi động.');
    }

    /**
     * Dừng scheduler (dùng khi tắt thông báo hoặc destroy app).
     */
    stopReminderScheduler(): void {
        if (this.schedulerIntervalId !== null) {
            clearInterval(this.schedulerIntervalId);
            this.schedulerIntervalId = null;
            console.log('[NotificationService] Scheduler đã dừng.');
        }
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
