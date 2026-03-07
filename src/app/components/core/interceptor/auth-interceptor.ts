import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '@/components/shared/services/notification-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const notif = inject(NotificationService);

  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned).pipe(
    catchError((err) => {
      if (err.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        notif.show('Session expirée, veuillez vous reconnecter', 'error');
        router.navigate(['/home']);
      }
      return throwError(() => err);
    })
  );
};
