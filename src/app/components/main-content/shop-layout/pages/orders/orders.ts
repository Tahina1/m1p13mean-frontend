import { AuthService } from '@/components/shared/services/auth';
import { OrderService } from '@/components/shared/services/order-service';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  orders = signal<any[]>([]);
  loading = signal(true);
  shopId: string | null = '';

  ngOnInit() {
    this.shopId = this.authService.shopId();
    this.orderService.getShopOrderById().subscribe((res: any) => {
      this.orders.set(res.orders);
      this.loading.set(false);
    });
  }

  updateStatus(orderId: string, status: string) {
    this.orderService.updateShopOrder(orderId, status).subscribe(() => this.reload());
  }

  reload() {
    this.loading.set(true);
    this.orderService.getShopOrders().subscribe((res: any) => {
      this.orders.set(res.orders);
      this.loading.set(false);
    });
  }
}
