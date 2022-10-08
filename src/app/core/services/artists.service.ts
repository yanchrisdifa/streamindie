import { Injectable } from '@angular/core';
import { find, map, Observable, of, tap } from 'rxjs';
import { artist } from '../models/artists.model';
import artistsData from '../../../assets/datas/artists.json';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class ArtistsService {
  constructor(private apollo: Apollo) {}

  getAllArtists(payload): Observable<artist | artist[]> {
    return this.apollo
      .watchQuery<any[]>({
        query: gql`
          query {
            users(${payload}) {
              id
              name
              userType
              image {
                url
              }
            }
          }
        `,
        variables: {},
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map((resp) => resp.data['users']));
  }
}
