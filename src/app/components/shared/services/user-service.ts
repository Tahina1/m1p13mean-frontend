import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { HttpRequestService } from './http-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpRequestService);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('api/users');
  }

  getUserById(id: string): Observable<User> {
    return this.http.get(`api/users/${id}`);
  }

  deleteUser(id: string) {
    return this.http.delete(`api/users/${id}`);
  }

  updateUser(id: string, data: any) {
    return this.http.patch(`api/users/${id}`, data);
  }
}
