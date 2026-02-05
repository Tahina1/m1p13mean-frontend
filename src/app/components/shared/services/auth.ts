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

  getAuth(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authorization') ?? '';
    }
    return '';
  }

  setAuth(token: string) {
    localStorage.setItem('authorization', token);
  }
  login(data: { email: string; password: string }): Observable<DefaultData> {
    return this.http.post(`/auth/login`, data);
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

  // logout(): Observable<DefaultData> {
  //   return this.http.post(`user/logout`, {});
  // }

  setAuthPopup(value: boolean) {
    this.loginPopup.set(value);
  }
}
