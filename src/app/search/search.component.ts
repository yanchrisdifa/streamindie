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
      this.getArtistsBySearch(this.searchTxt);
      this.getSongsBySearch(this.searchTxt);
      this.getGenresBySearch(this.searchTxt);
    });
    this.getCurrentPlayingSong();
  }

  getArtistsBySearch(searchTxt) {
    this.artistsResult = [];
    this.usersResult = [];
    this.subs.sink = this.artistsService
      .getAllArtists(
        `where: {name:{contains: "${searchTxt}"},userType: {in: [artist, user]} }`
      )
      .subscribe((resp: any) => {
        if (resp?.length) {
          this.separateArtistAndUser(resp);
        } else {
          this.getArtistsBySong(searchTxt);
        }
      });
  }

  getArtistsBySong(searchTxt) {
    this.subs.sink = this.artistsService
      .getAllArtists(
        `where: {songs: {some: {title: {contains: "${searchTxt}"}}}, userType: {in: [artist, user]}}`
      )
      .subscribe((resp) => {
        if (resp?.length) {
          this.separateArtistAndUser(resp);
        } else {
          this.getArtistByGenre(searchTxt);
        }
      });
  }

  getArtistByGenre(searchTxt) {
    this.subs.sink = this.artistsService
      .getAllArtists(
        `where: {songs: {some: {genre: {name: {contains: "${searchTxt}"}}}}, userType: {in: [artist, user]}}`
      )
      .subscribe((resp) => {
        if (resp?.length) {
          this.separateArtistAndUser(resp);
        }
      });
  }

  separateArtistAndUser(resp) {
    resp.forEach((data) => {
      if (data?.userType === 'artist') {
        this.artistsResult.push(data);
      } else if (data?.userType === 'user') {
        this.usersResult.push(data);
      }
    });
  }

  getSongsBySearch(searchTxt) {
    this.subs.sink = this.songsService
      .getAllSongs(`where: {title: {contains: "${searchTxt}"}}`)
      .subscribe((resp) => {
        this.songsResult = resp;
      });
  }

  getGenresBySearch(searchTxt) {
    this.subs.sink = this.genresService
      .getAllGenres(`where: {name: {contains: "${searchTxt}"}}`)
      .subscribe((resp) => {
        this.genresResult = resp;
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
