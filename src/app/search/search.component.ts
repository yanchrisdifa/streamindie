import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { artist } from '../core/models/artists.model';
import { ArtistsService } from '../core/services/artists.service';
import { GenresService } from '../core/services/genres.service';
import { SongsService } from '../core/services/songs.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchTxt: string;

  private subs = new SubSink();

  artistsResult: any[] = [];
  usersResult: any[] = [];
  songsResult: any[] = [];
  genresResult: any[] = [];

  currentPlayingSong: any;

  constructor(
    private route: ActivatedRoute,
    private artistsService: ArtistsService,
    private songsService: SongsService,
    private genresService: GenresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.searchTxt = param.get('searchText').trim().toLowerCase();
      this.getArtistsBySearch(this.searchTxt, 'init');
      this.getSongsBySearch(this.searchTxt, 'init');
      this.getGenresBySearch(this.searchTxt, 'init');
    });
    this.getCurrentPlayingSong();
  }

  getArtistsBySearch(searchTxt, type: string) {
    this.artistsResult = [];
    this.usersResult = [];
    let payload: string;
    if (type === 'init') {
      payload = `where: {name:{contains: "${searchTxt}"},userType: {in: [artist, user]} }`;
    } else if (type === 'song') {
      payload = `where: {songs: {some: {title: {contains: "${searchTxt}"}}}, userType: {in: [artist, user]}}`;
    } else if (type === 'genre') {
      payload = `where: {songs: {some: {genre: {name: {contains: "${searchTxt}"}}}}, userType: {in: [artist, user]}}`;
    }
    this.subs.sink = this.artistsService
      .getAllArtists(payload)
      .subscribe((resp: any) => {
        if (resp?.length) {
          resp.forEach((data) => {
            if (data?.userType === 'artist') {
              this.artistsResult.push(data);
            } else if (data?.userType === 'user') {
              this.usersResult.push(data);
            }
          });
        } else {
          if (type === 'init') {
            this.getArtistsBySearch(searchTxt, 'song');
          } else if (type === 'song') {
            this.getArtistsBySearch(searchTxt, 'genre');
          }
        }
      });
  }

  getSongsBySearch(searchTxt, type: string) {
    this.songsResult = [];
    let payload: string;
    if (type === 'init') {
      payload = `where: {title: {contains: "${searchTxt}"}}`;
    } else if (type === 'artist') {
      payload = `where: {artists: {name: {contains: "${searchTxt}"}}}`;
    } else if (type === 'genre') {
      payload = `where: {genre: {name: {contains: "${searchTxt}"}}}`;
    }
    this.subs.sink = this.songsService
      .getAllSongs(payload)
      .subscribe((resp) => {
        if (resp?.length) {
          this.songsResult = resp;
        } else {
          if (type === 'init') {
            this.getSongsBySearch(searchTxt, 'artist');
          } else if (type === 'artist') {
            this.getSongsBySearch(searchTxt, 'genre');
          }
        }
      });
  }

  getGenresBySearch(searchTxt, type: string) {
    this.genresResult = [];
    let payload: string;
    if (type === 'init') {
      payload = `where: {name: {contains: "${searchTxt}"}}`;
    } else if (type === 'artist') {
      payload = `where: {artists: {some: {name: {contains: "${searchTxt}"}}}}`;
    } else if (type === 'song') {
      payload = `where: {songs: {some: {title: {contains: "${searchTxt}"}}}}`;
    }
    this.subs.sink = this.genresService
      .getAllGenres(payload)
      .subscribe((resp) => {
        if (resp?.length) {
          this.genresResult = resp;
        } else {
          if (type === 'init') {
            this.getGenresBySearch(searchTxt, 'artist');
          } else if (type === 'artist') {
            this.getGenresBySearch(searchTxt, 'song');
          }
        }
      });
  }

  getCurrentPlayingSong() {
    this.subs.sink = this.songsService.currentPlayingSong$.subscribe((resp) => {
      this.currentPlayingSong = resp;
    });
  }

  setCurrentPlayingSong(songData) {
    this.songsService.setCurrentPlayingSong(songData);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
