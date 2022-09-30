import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  constructor(private apollo: Apollo) {}

  getAllSongs(): Observable<any[]> {
    return this.apollo
      .query<any[]>({
        query: gql`
          query {
            songs(take: 10) {
              id
              title
              genres {
                name
              }
              artists {
                name
              }
              postedAt
              audio {
                filename
                url
              }
              image {
                url
              }
            }
          }
        `,
        variables: {},
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp) => resp.data['songs']));
  }
}
