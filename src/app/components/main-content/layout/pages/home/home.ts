import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
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

  stores = [
    {
      name: 'zara',
      logo: 'assets/images/zara.png',
      sales: 30,
    },
    {
      name: 'nike',
      logo: 'assets/images/nike.png',
      sales: 0,
    },
    {
      name: 'h&m',
      logo: 'assets/images/h&m.png',
      sales: 50,
    },
    {
      name: 'adidas',
      logo: 'assets/images/adidas.png',
      sales: 0,
    },
    {
      name: 'pull&bear',
      logo: 'assets/images/pull&bear.png',
      sales: 0,
    },
    {
      name: 'bershka',
      logo: 'assets/images/bershka.png',
      sales: 0,
    },
  ];
}
