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
}
