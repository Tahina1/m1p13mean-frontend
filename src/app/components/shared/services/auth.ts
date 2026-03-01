import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { HttpRequestService } from './http-request';
import { Observable } from 'rxjs';
import { DefaultData } from '../models/global';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginPopup = signal(false);
  private readonly http = inject(HttpRequestService);
  private readonly platformId = inject(PLATFORM_ID);
  unauthorizedToken = signal(false);
  isLogged = signal(false);
  currentUser: any = signal({});
  userSignal = signal<any>(null);
  loading = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const user = sessionStorage.getItem('user');
      const token = sessionStorage.getItem('token');

      if (user && token) {
        this.userSignal.set(JSON.parse(user));
        this.isLogged.set(true);
      }
    }
  }

  getAuth(): string {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('token') ?? '';
    }
    return '';
  }

  setAuth(token: string) {
    localStorage.setItem('token', token);
  }

  login(data: { email: string | null; password: string | null }): Observable<DefaultData> {
    return this.http.post(`api/auth/login`, data);
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
    return !!sessionStorage.getItem('token');
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.userSignal.set(null);
  }
}
