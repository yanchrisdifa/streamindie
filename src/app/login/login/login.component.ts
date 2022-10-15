import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { GenresService } from 'src/app/core/services/genres.service';
import { SongsService } from 'src/app/core/services/songs.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  emailForm: FormControl = new FormControl(null, [
    Validators.required,
    Validators.email,
  ]);
  passwordForm: FormControl = new FormControl(null, Validators.required);

  constructor(
    private authService: AuthService,
    private router: Router,
    private songsService: SongsService,
    private genresService: GenresService,
    private apollo: Apollo,
    private _snackBar: MatSnackBar
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
            this.apollo.getClient().resetStore();
            this.router.navigate(['/app']);
          } else {
            this._snackBar.open('Username or Password Invalid', 'Ok', {
              duration: 3000,
            });
          }
        });
    }
  }
}
