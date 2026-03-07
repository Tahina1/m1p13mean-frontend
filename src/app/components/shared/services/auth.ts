import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { HttpRequestService } from './http-request';
import { Observable, tap } from 'rxjs';
import { DefaultData } from '../models/global';
import { Router } from '@angular/router';
import { NotificationService } from './notification-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly notif = inject(NotificationService);
  loginPopup = signal(false);
  private readonly http = inject(HttpRequestService);
  private readonly platformId = inject(PLATFORM_ID);
  unauthorizedToken = signal(false);
  isLogged = signal(false);
  currentUser: any = signal({});
  userSignal = signal<any>(null);
  shopId = signal<string | null>(null);
  loading = signal(false);
  activeRole = signal<'ADMIN' | 'SHOP' | 'CLIENT' | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const savedRole = localStorage.getItem('activeRole');

      if (user && token) {
        const parsed = JSON.parse(user);

        this.userSignal.set(parsed);
        this.shopId.set(parsed.shopId || null);
        this.isLogged.set(true);

        // 🔥 Restore activeRole
        if (savedRole && parsed.roles?.includes(savedRole)) {
          this.activeRole.set(savedRole as any);
        } else {
          // fallback logic if no saved role
          const fallback = parsed.roles?.includes('CLIENT') ? 'CLIENT' : parsed.roles?.[0];

          if (fallback) {
            this.activeRole.set(fallback as any);
            localStorage.setItem('activeRole', fallback);
          }
        }
      }
    }
  }

  setActiveRole(role: string) {
    this.activeRole.set(role as any);
    localStorage.setItem('activeRole', role);
  }

  getAuth(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token') ?? '';
    }
    return '';
  }

  setAuth(token: string) {
    localStorage.setItem('token', token);
  }

  login(data: { email: string | null; password: string | null }): Observable<DefaultData> {
    return this.http.post<DefaultData>(`api/auth/login`, data).pipe(
      tap((res: any) => {
        if (res.accessToken) {
          localStorage.setItem('token', res.accessToken);
        }

        localStorage.setItem('user', JSON.stringify(res.user));

        this.userSignal.set(res.user);
        this.shopId.set(res.user.shopId || null);

        const roles = res.user.roles || [];

        let defaultRole: 'ADMIN' | 'SHOP' | 'CLIENT' = 'CLIENT';

        if (roles.length === 1) defaultRole = roles[0];

        if (roles.length > 1) {
          defaultRole = roles.includes('CLIENT') ? 'CLIENT' : roles[0];
        }

        this.setActiveRole(defaultRole);
      })
    );
  }

  register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles: string[];
  }): Observable<DefaultData> {
    return this.http.post('api/auth/register', data);
  }

  setAuthPopup(value: boolean) {
    this.loginPopup.set(value);
  }

  getUser() {
    const user = localStorage.getItem('user');
    const parsed = user ? JSON.parse(user) : null;
    this.userSignal.set(parsed);
    return parsed;
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSignal.set(null);
    this.notif.show('Vous avez été déconnecté');
    this.router.navigate(['/home']);
  }
}
