import { Component, OnDestroy, OnInit } from '@angular/core';
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
  }

  getArtistsBySearch(searchTxt) {
    this.artistsResult = [];
    this.usersResult = [];
    this.subs.sink = this.artistsService
      .getAllArtists(
        `where: {name:{contains: "${searchTxt}"},userType: {in: [artist, user]} }`
      )
      .subscribe((resp: any) => {
        const tempResp = resp;
        tempResp.forEach((data) => {
          if (data?.userType === 'artist') {
            this.artistsResult.push(data);
          } else if (data?.userType === 'user') {
            this.usersResult.push(data);
          }
        });
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
