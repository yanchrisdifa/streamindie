import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { genre } from '../models/genres.model';
import genresData from '../../../assets/datas/genres.json';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  currentPlayingGenre$: BehaviorSubject<any> = new BehaviorSubject(null);
  oldPlayingGenreId: string;
  rawCurrentPlayingGenre: any;

  constructor(private apollo: Apollo) {}

  getAllGenres(payload): Observable<genre[]> {
    return this.apollo
      .query<any[]>({
        query: gql`
          query {
            genres(${payload}) {
              id
              name
              image {
                url
              }
            }
          }
        `,
        variables: {},
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp) => resp.data['genres']));
  }

  setCurrentPlayingGenre(genreData: any): void {
    if (genreData?.id === this.oldPlayingGenreId) {
      this.rawCurrentPlayingGenre = {
        ...this.rawCurrentPlayingGenre,
        isPlayed: this.rawCurrentPlayingGenre?.isPlayed === true ? false : true,
      };
    } else {
      this.rawCurrentPlayingGenre = {
        ...genreData,
        isPlayed: true,
      };
    }
    this.oldPlayingGenreId = genreData?.id;
    this.currentPlayingGenre$.next(this.rawCurrentPlayingGenre);
  }

  resetCurrentPlayingGenre() {
    this.currentPlayingGenre$.next(null);
    this.rawCurrentPlayingGenre = null;
    this.oldPlayingGenreId = null;
  }
}
