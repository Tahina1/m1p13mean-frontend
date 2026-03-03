import { Shop } from '@/components/shared/models/shop';
import { ShopService } from '@/components/shared/services/shop-service';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  shopService = inject(ShopService);
  shops = signal<Shop[]>([]);
  cards = [
    {
      title: 'Women',
      caption: 'New arrivals',
      img: 'assets/images/woman.png',
      alt: 'woman',
    },
    {
      title: 'Men',
      caption: 'Best sellers',
      img: 'assets/images/man.png',
      alt: 'man',
    },
    {
      title: 'Kids',
      caption: 'All sizes',
      img: 'assets/images/kids.png',
      alt: 'kid',
    },
    {
      title: 'Accessories',
      caption: 'Trending now',
      img: 'assets/images/accessories.png',
      alt: 'accessories',
    },
  ];

  ngOnInit() {
    this.loadShops();
  }

  loadShops() {
    this.shopService.getShops().subscribe({
      next: (res) => {
        this.shops.set(res.shops);
      },
      error: (err) => {
        console.error('Error loading shops', err);
      },
    });
  }
}
