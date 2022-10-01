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

  setCurrentPlayingSong(songData: any): void {
    console.log(
      this.oldPlayingSongId,
      songData?.id,
      this.oldPlayingSongId === songData?.id
    );
    if (this.oldPlayingSongId === songData?.id) {
      console.log('masuk sini 1?', songData);
      this.rawCurrentPlayingSong = {
        ...this.rawCurrentPlayingSong,
        isPlayed: this.rawCurrentPlayingSong?.isPlayed === true ? false : true,
      };
      console.log('masuk sini?', songData);
    } else {
      console.log('masuk else', songData);
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
