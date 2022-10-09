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
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-user-music-dialog',
  templateUrl: './user-music-dialog.component.html',
  styleUrls: ['./user-music-dialog.component.scss'],
})
export class UserMusicDialogComponent implements OnInit, OnDestroy {
  @ViewChild('songCover') songCover: ElementRef;
  @ViewChild('songCoverFileInput') songCoverFileInput: ElementRef;
  updatedSongCover: File = null;

  dialogForm: UntypedFormGroup;
  dialogFormOldVal;

  isDataUpdated: boolean = false;

  private subs = new SubSink();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogref: MatDialogRef<UserMusicDialogComponent>,
    private fb: UntypedFormBuilder,
    private songsService: SongsService
  ) {}

  ngOnInit(): void {
    console.log(this.data?.data);
    this.initForm();
  }

  initForm() {
    this.dialogForm = this.fb.group({
      title: [this.data?.data?.title, Validators.required],
    });
    this.dialogFormOldVal = _.cloneDeep(this.dialogForm.value);
    this.subs.sink = this.dialogForm.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((resp) => {
        this.isDataUpdated = !_.isEqual(this.dialogFormOldVal, resp);
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

  updateSong() {
    if (this.data?.data?.id && this.dialogForm.valid) {
      this.subs.sink = this.songsService
        .updateSong(this.data?.data?.id, this.cleanPayload())
        .subscribe((resp) => {
          this.dialogref.close();
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
    Object.keys(this.dialogFormOldVal).forEach((key) => {
      if (this.dialogFormOldVal[key] !== this.dialogForm.value[key]) {
        payload[`${key}`] = this.dialogForm.value[key];
      }
    });
    return payload;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
