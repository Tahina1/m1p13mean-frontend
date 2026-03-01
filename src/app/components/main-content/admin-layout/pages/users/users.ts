import { User } from '@/components/shared/models/user';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  page = signal(1);
  totalPages = signal(1);
  users = signal<User[]>([
    {
      _id: 'u1',
      firstName: 'Miam',
      lastName: 'Rakoto',
      email: 'miangaly@gmail.com',
      roles: ['ADMIN'],
      shopId: null,
    },
    {
      _id: 'u2',
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sarah@shop.com',
      roles: ['SHOP'],
      shopId: 'shop123',
    },
    {
      _id: 'u3',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@gmail.com',
      roles: ['CLIENT'],
      shopId: null,
    },
    {
      _id: 'u4',
      firstName: 'Lina',
      lastName: 'Martins',
      email: 'lina@nike.com',
      roles: ['SHOP'],
      shopId: 'shop456',
    },
  ]);

  prevPage() {}
  nextPage() {}
}
