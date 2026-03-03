import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  message = signal<string | null>(null);
  type = signal<NotificationType>('success');
  visible = signal(false);

  show(message?: string, type: NotificationType = 'success') {
    console.log('notif!');

    this.message.set(message || (type === 'success' ? 'Success' : 'Something went wrong'));
    this.type.set(type);
    this.visible.set(true);

    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  hide() {
    this.visible.set(false);
  }
}
