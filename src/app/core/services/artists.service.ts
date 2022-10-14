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

  getAllArtists(payload): Observable<artist[]> {
    return this.apollo
      .watchQuery<any[]>({
        query: gql`
          query {
            users(${payload}) {
              id
              name
              email
              userType
              password {
                isSet
              }
              image {
                url
                id
                width
                height
                filesize
                extension
              }
              profile_picture {
                url
                id
                width
                height
                filesize
                extension
              }
              songs {
                title
                id
                genre {
                  id
                  name
                }
                image {
                  url
                  id
                  width
                  height
                  filesize
                  extension
                }
                postedAt
                audio {
                  url
                  filename
                  filesize
                }
              }
              songsCount
              genres {
                id
                name
                image {
                  url
                  id
                  width
                  height
                  filesize
                  extension
                }
              }
              genresCount
            }
          }
        `,
        variables: {},
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map((resp) => resp.data['users']));
  }
}
