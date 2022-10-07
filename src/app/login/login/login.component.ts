import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { GenresService } from 'src/app/core/services/genres.service';
import { SongsService } from 'src/app/core/services/songs.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  emailForm: FormControl = new FormControl(null, [
    Validators.required,
    Validators.email,
  ]);
  passwordForm: FormControl = new FormControl(null, Validators.required);

  constructor(
    private authService: AuthService,
    private router: Router,
    private songsService: SongsService,
    private genresService: GenresService
  ) {}

  ngOnInit(): void {}

  login() {
    if (
      this.emailForm.value &&
      this.emailForm.valid &&
      this.passwordForm.value &&
      this.passwordForm.valid
    ) {
      this.authService
        .logIn(this.emailForm.value, this.passwordForm.value)
        .subscribe((resp) => {
          if (
            resp &&
            resp?.item &&
            resp?.sessionToken &&
            resp?.__typename === 'UserAuthenticationWithPasswordSuccess'
          ) {
            this.authService.setLocalUserProfileAndToken({
              token: resp.sessionToken,
              user: resp.item,
            });
            this.genresService.resetCurrentPlayingGenre();
            this.songsService.resetCurrentPlayingSong();
            localStorage.removeItem('currentPlayingSong');
            this.router.navigate(['/app']);
          }
        });
    }
  }
}