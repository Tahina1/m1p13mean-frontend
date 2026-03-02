import { CartService } from '@/components/shared/services/cart-service';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout-modal.html',
  styleUrl: './checkout-modal.scss',
})
export class CheckoutModal {
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
    if (this.form.invalid) return;

    const v = this.form.value;
    this.loading.set(true);

    this.cartService
      .checkout({
        billingDetails: {
          name: v.name,
          email: v.email,
          phone: v.phone,
        },
        shippingAddress: v.address,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.emit();
          this.close();
        },
        error: () => this.loading.set(false),
      });
  }
}
