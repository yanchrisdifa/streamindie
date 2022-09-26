import { Component, OnInit, ViewChild } from '@angular/core';
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  SwiperOptions,
  EffectCoverflow,
} from 'swiper';
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  EffectCoverflow,
]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  bannerData = [
    {
      image: '../../assets/images/banner-1.jpg',
      title: 'Niggaruto Was here to playing some music motherfucker',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim saepe voluptates, obcaecati nesciunt quaerat, placeat voluptatibus dolor reiciendis possimus magni nisi mollitia quos temporibus laborum vero omnis, alias dolores quidem? Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci dolorum consequuntur neque ea quae illo fuga magni fugiat architecto sunt libero quis optio in minus, tenetur temporibus error voluptates debitis.',
    },
    {
      image: '../../assets/images/banner-1.jpg',
      title: 'Lorem ipsum dolor sit amet consectetur. Lorem',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim saepe voluptates, obcaecati nesciunt quaerat, placeat voluptatibus dolor reiciendis possimus magni nisi mollitia quos temporibus laborum vero omnis, alias dolores quidem? Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci dolorum consequuntur neque ea quae illo fuga magni fugiat architecto sunt libero quis optio in minus, tenetur temporibus error voluptates debitis.',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  onSwiper(swiper) {
    console.log(swiper);
  }
  onSlideChange() {}
}
