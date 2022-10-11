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
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
