import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ArtistsService } from 'src/app/core/services/artists.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SubSink } from 'subsink';
import * as _ from 'lodash';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  @Input() userData: any;
  currentUser: any;
  private subs = new SubSink();
  isEditModeOpened: boolean = false;
  updatedProfilePicture: any;
  isDataUpdated: boolean = false;
  @ViewChild('userProfilePicture') userProfilePicture: ElementRef;
  @ViewChild('profilePictureFileInput') profilePictureFileInput: ElementRef;
  showPassword: boolean = false;

  userForm: UntypedFormGroup = this.fb.group({
    name: [null, Validators.required],
    password: [null],
    email: [null, [Validators.required, Validators.email]],
  });
  formOldVal: any;
  updatedVal: string[] = [];

  constructor(
    private authService: AuthService,
    private artistsService: ArtistsService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.getAuthenticatedUser();
  }

  subsFormValueChanges() {
    this.subs.sink = this.userForm
      .get('name')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((resp) => {
        if (this.formOldVal?.name !== resp) {
          this.updatedVal.push('name');
          this.updatedVal = _.uniq(this.updatedVal);
        } else {
          const index = this.updatedVal.findIndex(
            (keyUpdate) => keyUpdate === 'name'
          );
          if (index >= 0) {
            this.updatedVal.splice(index, 1);
          }
        }
      });
    this.subs.sink = this.userForm
      .get('password')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((resp) => {
        if (this.formOldVal?.password !== resp) {
          this.updatedVal.push('password');
          this.updatedVal = _.uniq(this.updatedVal);
        } else {
          const index = this.updatedVal.findIndex(
            (keyUpdate) => keyUpdate === 'password'
          );
          if (index >= 0) {
            this.updatedVal.splice(index, 1);
          }
        }
      });
    this.subs.sink = this.userForm
      .get('email')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((resp) => {
        if (this.formOldVal?.email !== resp) {
          this.updatedVal.push('email');
          this.updatedVal = _.uniq(this.updatedVal);
        } else {
          const index = this.updatedVal.findIndex(
            (keyUpdate) => keyUpdate === 'email'
          );
          if (index >= 0) {
            this.updatedVal.splice(index, 1);
          }
        }
      });
  }

  setIsDataUpdated() {
    this.subs.sink = this.userForm.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((data) => {
        console.log(this.updatedVal);
        this.isDataUpdated = this.updatedVal?.length ? true : false;
      });
  }

  getUserProfilePicture() {
    return this.userData?.profile_picture?.url
      ? `url(${this.userData.profile_picture.url})`
      : 'url(../../assets/images/default-user-profile.png)';
  }

  getAuthenticatedUser() {
    this.subs.sink = this.authService.authenticatedUser$.subscribe((resp) => {
      this.currentUser = resp;
      this.userForm.get('name').patchValue(this.currentUser?.name);
      this.userForm.get('email').patchValue(this.currentUser?.email);
      this.formOldVal = _.cloneDeep(this.userForm.value);
      if (this.userForm.get('name').value && this.userForm.get('email').value) {
        this.subsFormValueChanges();
        this.setIsDataUpdated();
      }
    });
  }

  loadProfilePicturePreview(target: HTMLInputElement) {
    const allowedFileExtension = ['image/png', 'image/jpeg', 'image/jpg'];
    if (
      !allowedFileExtension.includes(target?.files[0]?.type) ||
      !target.files.length
    ) {
      return;
    }

    this.updatedProfilePicture = target?.files[0];
    this.isDataUpdated = true;
    this.userProfilePicture.nativeElement.src = URL.createObjectURL(
      target.files[0]
    );
    this.profilePictureFileInput.nativeElement.onload = () => {
      URL.revokeObjectURL(this.userProfilePicture.nativeElement.src);
    };
  }

  save() {
    if (
      this.checkFormValidity() &&
      this.userData?.id === this.currentUser?.id &&
      this.isDataUpdated
    ) {
      this.subs.sink = this.artistsService
        .editUserOrArtist(this.currentUser?.id, this.cleanPayload())
        .subscribe((resp) => {
          this.isDataUpdated = false;
          this.isEditModeOpened = false;
        });
    }
  }

  checkFormValidity() {
    if (this.userForm.get('name').valid && this.userForm.get('email').valid) {
      return true;
    } else {
      return false;
    }
  }

  cleanPayload() {
    let payload: any = {};
    if (this.updatedProfilePicture) {
      payload.profile_picture = {
        upload: this.updatedProfilePicture,
      };
    }
    Object.keys(this.formOldVal).forEach((key) => {
      if (
        this.formOldVal[key] !== this.userForm.value[key] &&
        this.userForm.value[key]
      ) {
        payload[`${key}`] = this.userForm.value[key];
      }
    });
    return payload;
  }

  toggleEditMode() {
    this.isEditModeOpened = this.isEditModeOpened ? false : true;
  }
}
