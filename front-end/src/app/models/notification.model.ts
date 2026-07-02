export enum NotificationType {
    REVIEW_DUE = 'review_due',
    STREAK = 'streak',
    SYSTEM = 'system',
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: Date;
    actionUrl?: string;
    vocabularyId?: number;
}
