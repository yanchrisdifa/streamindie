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
}
