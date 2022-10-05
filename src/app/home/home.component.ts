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

  currentPlayingSong: any;
  currentPlayingGenre: any;

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
    this.getCurrentPlayingSong();
    this.getCurrentPlayingGenre();
  }

  getAllPopularArtist() {
    this.subs.sink = this.artistsService
      .getAllArtists('where: { userType: { equals: artist } }')
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
      .getAllGenres('take: 10')
      .subscribe((datas: genre[]) => {
        this.genresData = datas;
      });
  }

  getAllNewSongs() {
    this.subs.sink = this.songsService
      .getAllSongs('take: 10')
      .subscribe((datas) => {
        this.songsData = datas;
      });
  }

  getCurrentPlayingSong(type?) {
    this.subs.sink = this.songsService.currentPlayingSong$.subscribe((data) => {
      this.currentPlayingSong = data;
    });
  }

  setCurrentPlayingSong(songData: any): void {
    this.songsService.setCurrentPlayingSong(songData);
  }

  setCurrentPlayingSongByGenre(genreData: any): void {
    if (genreData?.id === this.genresService.oldPlayingGenreId) {
      this.genresService.setCurrentPlayingGenre(genreData);
      this.songsService.setCurrentPlayingSong(this.currentPlayingSong);
    } else {
      let tempSong = [];
      if (this.songsData?.length) {
        tempSong = this.songsData?.filter((songData) => {
          return songData?.genres?.find(
            (songGenre) => songGenre?.name === genreData?.name
          );
        });
      }
      if (tempSong?.length) {
        const randomIndex = Math.floor(
          Math.random() * (tempSong.length - 1 - 0) + 0
        );
        this.genresService.setCurrentPlayingGenre(genreData);
        this.songsService.setCurrentPlayingSong(tempSong[randomIndex]);
      }
    }
  }

  getCurrentPlayingGenre() {
    this.genresService.currentPlayingGenre$.subscribe((data) => {
      this.currentPlayingGenre = data;
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
