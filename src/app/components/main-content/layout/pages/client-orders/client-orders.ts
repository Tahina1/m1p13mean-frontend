import { OrderService } from '@/components/shared/services/order-service';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-orders',
  imports: [CommonModule, RouterLink],
  templateUrl: './client-orders.html',
  styleUrl: './client-orders.scss',
})
export class ClientOrders {
  private orderService = inject(OrderService);

  orders = signal<any[]>([]);
  loading = signal(true);

  page = signal(1);
  totalPages = signal(1);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);

    this.orderService.getClientOrderById(this.page()).subscribe({
      next: (res: any) => {
        this.orders.set(res.orders);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  changePage(p: number) {
    this.page.set(p);
    this.loadOrders();
  }
}
