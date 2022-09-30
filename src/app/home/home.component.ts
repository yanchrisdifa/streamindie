import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubSink } from 'subsink';
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
import { artist } from '../core/models/artists.model';
import { genre } from '../core/models/genres.model';
import { ArtistsService } from '../core/services/artists.service';
import { GenresService } from '../core/services/genres.service';
import { SongsService } from '../core/services/songs.service';
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
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  artistsData: artist[];
  genresData: genre[];
  songsData: any[];

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

  isArtistsStared: boolean[] = [];
  isArtistsSaved: boolean[] = [];

  private subs = new SubSink();

  constructor(
    private artistsService: ArtistsService,
    private genresService: GenresService,
    private songsService: SongsService
  ) {}

  ngOnInit(): void {
    this.getAllPopularArtist();
    this.getAllGenres();
    this.getAllNewSongs();
  }

  getAllPopularArtist() {
    this.subs.sink = this.artistsService
      .getAllArtists()
      .subscribe((datas: artist[]) => {
        this.artistsData = datas;
        datas.forEach(() => {
          this.isArtistsStared.push(false);
          this.isArtistsSaved.push(false);
        });
      });
  }

  getAllGenres() {
    this.subs.sink = this.genresService
      .getAllGenres()
      .subscribe((datas: genre[]) => {
        this.genresData = datas;
      });
  }

  getAllNewSongs() {
    this.subs.sink = this.songsService.getAllSongs().subscribe((data) => {
      this.songsData = data;
    });
  }

  starOrUnstarArtist(index: number): void {
    this.isArtistsStared[index] = this.isArtistsStared[index] ? false : true;
  }

  saveOrUnsaveArtist(index: number): void {
    this.isArtistsSaved[index] = this.isArtistsSaved[index] ? false : true;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
