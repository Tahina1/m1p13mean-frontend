import { Component, effect, inject, OnInit } from '@angular/core';
import { MainContent } from './components/main-content/main-content';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './components/shared/services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainContent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly authServices = inject(AuthService);

  title = 'm1p13mean-frontend';

  // constructor() {
  //   effect(
  //     () => {
  //       if (this.authServices.isLogged()) {
  //         this.decodeToken();
  //       }
  //     },
  //     { allowSignalWrites: true }
  //   );
  // }

  // ngOnInit() {
  //   this.decodeToken();
  // }

  // decodeToken() {
  //   const helper = new JwtHelperService();
  //   const decodedUser = helper.decodeToken(localStorage.getItem('authorization') ?? '');
  //   this.authServices.currentUser.set(decodedUser);
  //   this.authServices.isLogged.set(false);
  // }
}
