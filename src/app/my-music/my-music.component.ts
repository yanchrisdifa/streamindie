import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SubSink } from 'subsink';
import { AuthService } from '../core/services/auth.service';
import { SongsService } from '../core/services/songs.service';

@Component({
  selector: 'app-my-music',
  templateUrl: './my-music.component.html',
  styleUrls: ['./my-music.component.scss'],
})
export class MyMusicComponent implements OnInit {
  songsData$: BehaviorSubject<any> = new BehaviorSubject(null);
  userData: any;
  private subs = new SubSink();

  constructor(
    private authService: AuthService,
    private songsService: SongsService
  ) {}

  ngOnInit(): void {
    this.getAuthenticatedUser();
  }

  getAuthenticatedUser() {
    this.subs.sink = this.authService
      .getAuthenticatedUser()
      .subscribe((resp) => {
        this.userData = resp;
        this.getSongsData();
      });
  }

  getSongsData() {
    this.subs.sink = this.songsService
      .getAllSongs(`where:{artists:{id:{equals:"${this.userData?.id}"}}}`)
      .subscribe((resp) => {
        this.songsData$.next(resp);
      });
  }
}
