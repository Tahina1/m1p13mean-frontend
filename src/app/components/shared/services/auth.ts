import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { HttpRequestService } from './http-request';
import { Observable } from 'rxjs';
// import { DefaultData } from '../../shared/models/global';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpRequestService);
  private readonly platformId = inject(PLATFORM_ID);
  unauthorizedToken: WritableSignal<boolean> = signal(false);
  isLogged: WritableSignal<boolean> = signal(false);
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
  // login(data: { username: string; password: string }): Observable<DefaultData> {
  //   return this.http.post(`login`, data);
  // }
  // logout(): Observable<DefaultData> {
  //   return this.http.post(`user/logout`, {});
  // }
}
