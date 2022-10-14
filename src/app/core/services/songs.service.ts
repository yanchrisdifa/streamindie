import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  currentPlayingSong$: BehaviorSubject<any> = new BehaviorSubject(
    JSON.parse(localStorage.getItem('currentPlayingSong'))
  );

  rawCurrentPlayingSong: any;
  oldPlayingSongId: string;

  constructor(private apollo: Apollo) {}

  getAllSongs(payload): Observable<any[]> {
    return this.apollo
      .query<any[]>({
        query: gql`
          query {
            songs(${payload}) {
              id
              title
              genre {
                id
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

  updateSong(id, data): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation updateSong($id: ID, $data: SongUpdateInput!) {
          updateSong(where: { id: $id }, data: $data) {
            id
            title
            image {
              id
              url
              extension
            }
          }
        }
      `,
      variables: {
        id,
        data,
      },
    });
  }

  createSong(data): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation createSong($data: SongCreateInput!) {
          createSong(data: $data) {
            id
            title
            image {
              id
              url
              extension
            }
          }
        }
      `,
      variables: {
        data,
      },
    });
  }

  deleteSong(id): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation deleteSong($id: ID) {
          deleteSong(where: { id: $id }) {
            id
            title
            image {
              id
              url
              extension
            }
          }
        }
      `,
      variables: {
        id,
      },
    });
  }

  getSongCount(where): Observable<any> {
    return this.apollo
      .watchQuery({
        query: gql`
          query songsCount($where: SongWhereInput!) {
            songsCount(where: $where)
          }
        `,
        variables: {
          where,
        },
      })
      .valueChanges.pipe(map((resp) => resp.data['songsCount']));
  }

  setCurrentPlayingSong(songData: any): void {
    if (this.oldPlayingSongId === songData?.id) {
      this.rawCurrentPlayingSong = {
        ...this.rawCurrentPlayingSong,
        isPlayed: this.rawCurrentPlayingSong?.isPlayed === true ? false : true,
      };
    } else {
      this.rawCurrentPlayingSong = {
        ...songData,
        isPlayed: true,
      };
    }
    this.oldPlayingSongId = songData?.id;
    localStorage.setItem(
      'currentPlayingSong',
      JSON.stringify(this.rawCurrentPlayingSong)
    );
    this.currentPlayingSong$.next(
      JSON.parse(localStorage.getItem('currentPlayingSong'))
    );
  }

  resetCurrentPlayingSong() {
    this.currentPlayingSong$.next(null);
    this.rawCurrentPlayingSong = null;
    this.oldPlayingSongId = null;
  }
}
