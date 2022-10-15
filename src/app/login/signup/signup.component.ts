import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { GenresService } from 'src/app/core/services/genres.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  usernameForm: FormControl = new FormControl(null, Validators.required);
  emailForm: FormControl = new FormControl(null, [
    Validators.required,
    Validators.email,
  ]);
  passwordForm: FormControl = new FormControl(null, Validators.required);
  confirmPasswordForm: FormControl = new FormControl(null, Validators.required);

  private subs = new SubSink();

  constructor(
    private authService: AuthService,
    private router: Router,
    private songsService: SongsService,
    private genresService: GenresService,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {}

  signUp() {
    if (this.checkFormValidity()) {
      this.subs.sink = this.authService
        .signIn(this.cleanPayload())
        .subscribe((resp) => {
          if (resp?.id) {
            this.genresService.resetCurrentPlayingGenre();
            this.songsService.resetCurrentPlayingSong();
            localStorage.removeItem('currentPlayingSong');
            this.apollo.getClient().resetStore();
            this.router.navigate(['/session/login']);
          }
        });
    }
  }

  cleanPayload() {
    let payload: any = {};
    if (this.checkFormValidity()) {
      payload.name = this.usernameForm.value;
      payload.email = this.emailForm.value;
      payload.password = this.passwordForm.value;
      payload.userType = 'user';
    }
    return payload;
  }

  checkFormValidity() {
    if (
      this.usernameForm.valid &&
      this.emailForm.valid &&
      this.passwordForm.valid &&
      this.confirmPasswordForm.valid &&
      this.passwordForm.value === this.confirmPasswordForm.value
    ) {
      return true;
    } else {
      return false;
    }
  }
}
