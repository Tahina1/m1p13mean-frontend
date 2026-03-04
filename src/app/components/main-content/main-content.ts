import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../shared/services/auth';

@Component({
  selector: 'app-main-content',
  imports: [RouterOutlet],
  templateUrl: './main-content.html',
  styleUrl: './main-content.scss',
})
export class MainContent {
  private readonly authService = inject(AuthService);
  // ngOnInit() {
  //   if (!localStorage.getItem('token')) {
  //     this.authService
  //       .login({
  //         email: 'all@gmail.com',
  //         password: '12345',
  //       })
  //       .subscribe();
  //   }
  // }
}
