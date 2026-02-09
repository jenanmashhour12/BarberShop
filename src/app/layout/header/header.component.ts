import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/notification.service';
import { NotificationItem } from '../../core/notification.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  currentDate = this.getCurrentDate();
  notificationsOpen = false;

  notifications: NotificationItem[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getUnread()
      .subscribe((data: NotificationItem[]) => {
        this.notifications = data;
      });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  toggleNotifications(event: MouseEvent): void {
    event.stopPropagation();
    this.notificationsOpen = !this.notificationsOpen;

    if (this.notificationsOpen) {
      this.loadNotifications();
    }
  }

  closeNotifications(): void {
    this.notificationsOpen = false;
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead()
      .subscribe(() => {
        this.notifications = this.notifications.map(n => ({
          ...n,
          read: true
        }));
      });
  }

  private getCurrentDate(): string {
    const now = new Date();
    return now.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }
}
