import { Injectable } from '@angular/core';
import { find, map, Observable, of, tap } from 'rxjs';
import { artist } from '../models/artists.model';
import artistsData from '../../../assets/datas/artists.json';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { SongsService } from './songs.service';
import { GenresService } from './genres.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private apollo: Apollo,
    private router: Router,
    private songsService: SongsService,
    private genresService: GenresService
  ) {}

  logIn(email: string, password: string): Observable<any> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation authenticateUserWithPassword(
            $email: String!
            $password: String!
          ) {
            authenticateUserWithPassword(email: $email, password: $password) {
              ... on UserAuthenticationWithPasswordSuccess {
                item {
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
                sessionToken
              }
              ... on UserAuthenticationWithPasswordFailure {
                message
              }
            }
          }
        `,
        variables: {
          email,
          password,
        },
      })
      .pipe(map((resp: any) => resp.data['authenticateUserWithPassword']));
  }

  getAuthenticatedUser(): Observable<any> {
    return this.apollo
      .watchQuery({
        query: gql`
          query {
            authenticatedItem {
              ... on User {
                id
                name
                email
                userType
                profile_picture {
                  url
                  id
                  width
                  height
                  filesize
                  extension
                }
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
                songs {
                  title
                  id
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
          }
        `,
      })
      .valueChanges.pipe(map((resp: any) => resp.data['authenticatedItem']));
  }

  logOut() {
    this.genresService.resetCurrentPlayingGenre();
    this.songsService.resetCurrentPlayingSong();
    localStorage.clear();
    this.apollo.getClient().resetStore();
    this.router.navigate(['/session/login']);
  }

  setLocalUserProfileAndToken(value: { token: string; user: any }) {
    localStorage.setItem('userProfile', JSON.stringify(value.user));
    localStorage.setItem('sessionToken', JSON.stringify(value.token));
  }

  getLocalStorageUser() {
    return JSON.parse(localStorage.getItem('userProfile'));
  }
}
