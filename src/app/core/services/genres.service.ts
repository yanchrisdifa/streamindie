import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { genre } from '../models/genres.model';
import genresData from '../../../assets/datas/genres.json';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  constructor(private apollo: Apollo) {}

  getAllGenres(payload): Observable<genre | genre[]> {
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
}
