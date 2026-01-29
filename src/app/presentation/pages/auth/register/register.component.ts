import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@application/services/auth.service';

/**
 * Register page component.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
      <h3 class="text-lg font-medium text-gray-900 mb-6">Create your account</h3>

      @if (authService.error()) {
        <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {{ authService.error() }}
        </div>
      }

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700">
            First name
          </label>
          <div class="mt-1">
            <input
              id="firstName"
              type="text"
              formControlName="firstName"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          @if (form.get('firstName')?.touched && form.get('firstName')?.errors?.['required']) {
            <p class="mt-1 text-sm text-red-600">First name is required</p>
          }
        </div>

        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700">
            Last name
          </label>
          <div class="mt-1">
            <input
              id="lastName"
              type="text"
              formControlName="lastName"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          @if (form.get('lastName')?.touched && form.get('lastName')?.errors?.['required']) {
            <p class="mt-1 text-sm text-red-600">Last name is required</p>
          }
        </div>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div class="mt-1">
          <input
            id="email"
            type="email"
            formControlName="email"
            autocomplete="email"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        @if (form.get('email')?.touched && form.get('email')?.errors?.['required']) {
          <p class="mt-1 text-sm text-red-600">Email is required</p>
        }
        @if (form.get('email')?.touched && form.get('email')?.errors?.['email']) {
          <p class="mt-1 text-sm text-red-600">Please enter a valid email</p>
        }
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div class="mt-1">
          <input
            id="password"
            type="password"
            formControlName="password"
            autocomplete="new-password"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        @if (form.get('password')?.touched && form.get('password')?.errors?.['required']) {
          <p class="mt-1 text-sm text-red-600">Password is required</p>
        }
        @if (form.get('password')?.touched && form.get('password')?.errors?.['minlength']) {
          <p class="mt-1 text-sm text-red-600">Password must be at least 8 characters</p>
        }
      </div>

      <div>
        <button
          type="submit"
          [disabled]="form.invalid || authService.loading()"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          @if (authService.loading()) {
            <span>Creating account...</span>
          } @else {
            <span>Create account</span>
          }
        </button>
      </div>

      <div class="text-sm text-center">
        <span class="text-gray-600">Already have an account?</span>
        <a routerLink="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
          Sign in
        </a>
      </div>
    </form>
  `,
  styles: [],
})
export class RegisterComponent {
  protected readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    const { firstName, lastName, email, password } = this.form.value;
    this.authService.register({ firstName, lastName, email, password }).subscribe();
  }
}
