import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  @Input() userData: any;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.userData);
    }, 2000);
  }

  getUserProfilePicture() {
    return this.userData?.profile_picture?.url
      ? `url(${this.userData.profile_picture.url})`
      : 'url(../../assets/images/default-user-profile.png)';
  }
}
