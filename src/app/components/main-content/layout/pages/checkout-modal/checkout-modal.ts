import { NotificationComponent } from '@/components/shared/components/notification-component/notification-component';
import { CartService } from '@/components/shared/services/cart-service';
import { NotificationService } from '@/components/shared/services/notification-service';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout-modal',
  imports: [ReactiveFormsModule, NotificationComponent],
  templateUrl: './checkout-modal.html',
  styleUrl: './checkout-modal.scss',
})
export class CheckoutModal {
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);

  isOpen = signal(false);
  loading = signal(false);

  @Output() success = new EventEmitter<void>();

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
  });

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.show('Please fill all required fields correctly', 'error');
      return;
    }

    const v = this.form.value;
    this.loading.set(true);

    this.cartService
      .checkout({
        billingDetails: {
          name: v.name ?? '',
          email: v.email ?? '',
          phone: v.phone ?? '',
        },
        shippingAddress: v.address ?? '',
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.emit();
          this.close();
          this.notificationService.show('Order placed successfully 🎉', 'success');
        },
        error: (err) => {
          this.loading.set(false);

          const message =
            err?.error?.message || err?.error?.error || 'Checkout failed. Please try again.';

          this.notificationService.show(message, 'error');
        },
      });
  }
}
