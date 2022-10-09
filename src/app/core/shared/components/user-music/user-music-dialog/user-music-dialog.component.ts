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

@Component({
  selector: 'app-user-music-dialog',
  templateUrl: './user-music-dialog.component.html',
  styleUrls: ['./user-music-dialog.component.scss'],
})
export class UserMusicDialogComponent implements OnInit, OnDestroy {
  @ViewChild('songCover') songCover: ElementRef;
  @ViewChild('songCoverFileInput') songCoverFileInput: ElementRef;
  updatedSongCover: File;

  dialogForm: UntypedFormGroup;

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
      image: this.fb.group({
        upload: [null, Validators.required],
      }),
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

    this.dialogForm.get('image').get('upload').patchValue(target?.files[0]);
    this.songCover.nativeElement.src = URL.createObjectURL(target.files[0]);
    this.songCoverFileInput.nativeElement.onload = () => {
      URL.revokeObjectURL(this.songCover.nativeElement.src);
    };
  }

  updateSong() {
    console.log(this.dialogForm.value);
    if (this.data?.data?.id && this.dialogForm.valid) {
      this.subs.sink = this.songsService
        .updateSong(this.data?.data?.id, this.dialogForm.value)
        .subscribe((resp) => {
          this.dialogref.close();
        });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
