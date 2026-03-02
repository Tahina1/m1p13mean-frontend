import { Pagination } from '@/components/shared/components/pagination/pagination';
import { User } from '@/components/shared/models/user';
import { UserService } from '@/components/shared/services/user-service';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-users',
  imports: [Pagination],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private userService = inject(UserService);

  users = signal<User[]>([]);
  loading = signal(false);

  // ignore pagination for now but keep ready
  page = signal(1);
  totalPages = signal(1);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);

    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users.set(res);
      },
      error: (err) => {
        console.error('GET USERS ERROR', err);
      },
      complete: () => this.loading.set(false),
    });
  }

  onPageChange(p: number) {
    this.page.set(p);
    // later when pagination exists:
    // this.loadUsers();
  }
}
