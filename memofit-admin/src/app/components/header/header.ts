import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import {
  Notification,
  NotificationType,
} from '../../models/notification.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
})
export class Header {
  @Input() title!: string;

  protected readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);
  readonly isDropdownOpen = signal(false);
  readonly notifications = this.notificationService.notifications;
  readonly unreadCount = this.notificationService.unreadCount;

  protected readonly NotificationType = NotificationType;

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen.update((open) => !open);
  }

  onNotificationClick(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id);
    }

    if (notification.actionUrl) {
      this.router.navigate([notification.actionUrl]);
    }

    this.isDropdownOpen.set(false);
  }

  markAllAsRead(event: Event): void {
    event.stopPropagation();
    this.notificationService.markAllAsRead();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen.set(false);
    }
  }

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.REVIEW_DUE:
        return 'fi fi-rr-book-alt';
      case NotificationType.STREAK:
        return 'fi fi-rr-flame';
      case NotificationType.SYSTEM:
        return 'fi fi-rr-info';
      default:
        return 'fi fi-rr-bell';
    }
  }

  getNotificationColor(type: NotificationType): string {
    switch (type) {
      case NotificationType.REVIEW_DUE:
        return 'text-amber-500';
      case NotificationType.STREAK:
        return 'text-orange-500';
      case NotificationType.SYSTEM:
        return 'text-blue-500';
      default:
        return 'text-slate-500';
    }
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return new Date(date).toLocaleDateString('vi-VN');
  }
}
