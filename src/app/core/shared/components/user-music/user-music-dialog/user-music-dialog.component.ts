import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SongsService } from 'src/app/core/services/songs.service';
import { SubSink } from 'subsink';
import * as _ from 'lodash';
import { debounceTime, distinct, distinctUntilChanged } from 'rxjs';
import { GenresService } from 'src/app/core/services/genres.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';
import { ArtistsService } from 'src/app/core/services/artists.service';

@Component({
  selector: 'app-user-music-dialog',
  templateUrl: './user-music-dialog.component.html',
  styleUrls: ['./user-music-dialog.component.scss'],
})
export class UserMusicDialogComponent implements OnInit, OnDestroy {
  @ViewChild('songCover') songCover: ElementRef;
  @ViewChild('songCoverFileInput') songCoverFileInput: ElementRef;
  updatedSongCover: File = null;
  updatedSongAudio: File = null;

  dialogForm: UntypedFormGroup;
  dialogFormOldVal;

  isDataUpdated: boolean = false;

  filteredGenresData: any;
  isGenreOptionClicked: boolean = false;

  updatedVal: string[] = [];

  filteredValues: any = {
    title: null,
    image: null,
    genre: {
      connect: {
        id: null,
      },
    },
  };

  currentUser: any;

  private subs = new SubSink();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogref: MatDialogRef<UserMusicDialogComponent>,
    private fb: UntypedFormBuilder,
    private songsService: SongsService,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private artistsService: ArtistsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAuthenticatedUser();
    this.filteredGenresData = this.data?.genresData;
  }

  initForm() {
    this.dialogForm = this.fb.group({
      title: [
        this.data?.data?.title ? this.data?.data?.title : null,
        Validators.required,
      ],
      genre: [
        this.data?.data?.genre?.id ? this.data?.data?.genre?.id : null,
        Validators.required,
      ],
    });
    this.dialogFormOldVal = _.cloneDeep(this.dialogForm.value);
    this.subsFormValueChanges();
    this.setIsDataUpdated();
    if (this.data?.type === 'delete') {
      this.dialogForm.disable();
    }
  }

  subsFormValueChanges() {
    this.subs.sink = this.dialogForm
      .get('title')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((resp) => {
        if (this.dialogFormOldVal?.title !== resp) {
          this.updatedVal.push('title');
          this.updatedVal = _.uniq(this.updatedVal);
        } else {
          const index = this.updatedVal.findIndex(
            (keyUpdate) => keyUpdate === 'title'
          );
          if (index >= 0) {
            this.updatedVal.splice(index, 1);
          }
        }
      });
    this.subs.sink = this.dialogForm
      .get('genre')
      .valueChanges.pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((resp) => {
        if (this.isGenreOptionClicked) {
          const tempGenre = this.data?.genresData?.find((genre) => {
            return genre?.id === resp;
          });
          resp = this.displayGenreName(resp);
          if (tempGenre?.id !== this.dialogFormOldVal?.genre) {
            this.updatedVal.push('genre');
          } else {
            const index = this.updatedVal.findIndex(
              (keyUpdate) => keyUpdate === 'genre'
            );
            if (index >= 0) {
              this.updatedVal.splice(index, 1);
            }
          }
        } else {
          const index = this.updatedVal.findIndex(
            (keyUpdate) => keyUpdate === 'genre'
          );
          if (index >= 0) {
            this.updatedVal.splice(index, 1);
          }
        }
        this.filteredGenresData = this.data?.genresData?.filter((genre) => {
          return genre?.name
            .trim()
            .toLowerCase()
            .includes(resp.trim().toLowerCase());
        });
      });
  }

  closeDialog() {
    this.dialogref.close();
  }

  loadCoverPreview(target: HTMLInputElement) {
    const allowedFileExtension = ['image/png', 'image/jpeg', 'image/jpg'];
    if (
      !allowedFileExtension.includes(target?.files[0]?.type) ||
      !target.files.length
    ) {
      return;
    }

    this.updatedSongCover = target?.files[0];
    this.isDataUpdated = true;
    this.songCover.nativeElement.src = URL.createObjectURL(target.files[0]);
    this.songCoverFileInput.nativeElement.onload = () => {
      URL.revokeObjectURL(this.songCover.nativeElement.src);
    };
  }

  loadAudio(target: HTMLInputElement) {
    const allowedFileExtension = ['audio/mp3', 'audio/m4a', 'audio/mpeg'];
    if (
      !allowedFileExtension.includes(target?.files[0]?.type) ||
      !target.files.length
    ) {
      return;
    }
    this.updatedSongAudio = target?.files[0];
  }

  setIsDataUpdated() {
    this.subs.sink = this.dialogForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((data) => {
        this.isDataUpdated =
          this.updatedVal?.length || this.updatedSongCover ? true : false;
      });
  }

  saveSong() {
    if (!this.dialogForm.valid) {
      this._snackBar.open('Please fill all the required fields', 'Ok', {
        duration: 3000,
      });
      return;
    } else if (
      this.dialogForm.valid &&
      !this.isGenreOptionClicked &&
      this.dialogForm.get('genre').value !== this.dialogFormOldVal?.genre
    ) {
      this._snackBar.open(
        'Please select your song genre from the dropdown',
        'Ok',
        {
          duration: 3000,
        }
      );
      return;
    }
    if (this.data?.type === 'edit') {
      if (this.data?.data?.id && this.dialogForm.valid && this.isDataUpdated) {
        this.subs.sink = this.songsService
          .updateSong(this.data?.data?.id, this.cleanPayload())
          .subscribe((resp) => {
            this.dialogref.close({ isSaved: true });
          });
      } else if (!this.isDataUpdated) {
        this._snackBar.open('Please update the data before you save', 'Ok', {
          duration: 3000,
        });
      }
    } else if (this.data?.type === 'add') {
      if (
        this.dialogForm.valid &&
        this.updatedSongCover &&
        this.updatedSongAudio
      ) {
        this.subs.sink = this.songsService
          .createSong(this.cleanPayload())
          .subscribe((resp) => {
            this.setUserAsArtist();
            this.dialogref.close({ isSaved: true });
          });
      } else if (!this.updatedSongCover && !this.updatedSongAudio) {
        this._snackBar.open(
          'Please insert your song cover and audio before you save',
          'Ok',
          {
            duration: 3000,
          }
        );
      } else if (!this.updatedSongCover) {
        this._snackBar.open(
          'Please insert your song cover before you save',
          'Ok',
          {
            duration: 3000,
          }
        );
      } else if (!this.updatedSongAudio) {
        this._snackBar.open(
          'Please insert your song audio before you save',
          'Ok',
          {
            duration: 3000,
          }
        );
      }
    }
  }

  deleteSong(id: string) {
    if (id) {
      this.subs.sink = this.songsService.deleteSong(id).subscribe((resp) => {
        this.dialogref.close({ isSaved: true });
      });
    }
  }

  cleanPayload() {
    let payload: any = {};
    if (this.updatedSongCover) {
      payload.image = {
        upload: this.updatedSongCover,
      };
    }
    if (this.data?.type === 'add') {
      payload.artists = {
        connect: {
          id: this.data?.currentArtistId,
        },
      };
      if (this.updatedSongAudio) {
        payload.audio = {
          upload: this.updatedSongAudio,
        };
      }
    }
    Object.keys(this.dialogFormOldVal).forEach((key) => {
      if (this.dialogFormOldVal[key] !== this.dialogForm.value[key]) {
        if (key === 'title') {
          payload[`${key}`] = this.dialogForm.value[key];
        } else if (key === 'genre') {
          payload.genre = {
            connect: {
              id: this.dialogForm.value[key],
            },
          };
        }
      }
    });
    return payload;
  }

  getAuthenticatedUser() {
    this.subs.sink = this.authService.authenticatedUser$.subscribe((resp) => {
      this.currentUser = resp;
    });
  }

  setUserAsArtist() {
    if (this.currentUser?.userType === 'user') {
      this.subs.sink = this.artistsService
        .editUserOrArtist(this.currentUser?.id, { userType: 'artist' })
        .subscribe((resp) => {
          this.authService.authenticatedUser$.next(resp);
        });
    }
  }

  displayGenreName(id) {
    if (this.data?.genresData?.length) {
      const temp = this.data?.genresData?.find((genre) => genre?.id === id);
      return temp?.name;
    }
  }

  setGenreOptionClicked(value: boolean) {
    this.isGenreOptionClicked = value;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
