import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-component',
  imports: [CommonModule],
  templateUrl: './notification-component.html',
  styleUrl: './notification-component.scss',
})
export class NotificationComponent {
  notif = inject(NotificationService);
}
