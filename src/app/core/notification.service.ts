import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationItem } from './notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private API = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) {}

  getUnread(): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(`${this.API}/unread`);
  }

  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.API}/mark-all-read`, {});
  }

  push(notification: NotificationItem): Observable<NotificationItem> {
    return this.http.post<NotificationItem>(this.API, notification);
  }
}
