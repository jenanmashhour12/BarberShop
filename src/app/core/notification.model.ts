export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'success' | 'info' | 'warning';
    read: boolean;
  }
  