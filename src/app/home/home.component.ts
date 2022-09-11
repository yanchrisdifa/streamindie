import { Component, OnInit, ViewChild } from '@angular/core';
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  SwiperOptions,
} from 'swiper';
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  bannerData = [
    {
      image: '../../assets/images/banner-1.png',
      title:
        'Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio, repellat?',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim saepe voluptates, obcaecati nesciunt quaerat, placeat voluptatibus dolor reiciendis possimus magni nisi mollitia quos temporibus laborum vero omnis, alias dolores quidem? Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci dolorum consequuntur neque ea quae illo fuga magni fugiat architecto sunt libero quis optio in minus, tenetur temporibus error voluptates debitis.',
    },
    {
      image: '../../assets/images/banner-1.png',
      title:
        'Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio, repellat?',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim saepe voluptates, obcaecati nesciunt quaerat, placeat voluptatibus dolor reiciendis possimus magni nisi mollitia quos temporibus laborum vero omnis, alias dolores quidem? Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci dolorum consequuntur neque ea quae illo fuga magni fugiat architecto sunt libero quis optio in minus, tenetur temporibus error voluptates debitis.',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  onSwiper(swiper) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }
}
