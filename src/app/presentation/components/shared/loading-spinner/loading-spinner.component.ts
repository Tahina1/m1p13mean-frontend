import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Loading spinner component.
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center" [ngClass]="containerClass">
      <div
        class="animate-spin rounded-full border-t-2 border-b-2 border-indigo-600"
        [ngClass]="sizeClass"
      ></div>
      @if (text) {
        <span class="ml-3 text-gray-600">{{ text }}</span>
      }
    </div>
  `,
  styles: [],
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() text?: string;
  @Input() containerClass = '';

  get sizeClass(): string {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
    };
    return sizes[this.size];
  }
}
