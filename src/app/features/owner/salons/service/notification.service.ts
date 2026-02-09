import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {}

  getUnread() {
    return this.http.get<any[]>('http://localhost:8080/api/notifications');
  }

  markAllAsRead() {
    return this.http.put(
      'http://localhost:8080/api/notifications/read-all',
      {}
    );
  }
}
