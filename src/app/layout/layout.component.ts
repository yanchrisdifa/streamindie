import { Component, OnInit } from '@angular/core';
import { SongsService } from 'src/app/core/services/songs.service';
import { MenuItems } from 'src/app/menu-items';
import { Menu } from 'src/app/menu-items.model';
import { SubSink } from 'subsink';
import { ArtistsService } from '../core/services/artists.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  userData: any;
  menuList: Menu[];
  isLoading: boolean = false;

  private subs = new SubSink();

  constructor(
    private menuItems: MenuItems,
    private authService: AuthService,
    private artistsService: ArtistsService
  ) {}

  ngOnInit(): void {
    this.menuList = this.menuItems.menus;
    this.getAuthenticatedUser();
  }

  logOut() {
    this.authService.logOut();
  }

  getAuthenticatedUser() {
    this.isLoading = true;
    this.subs.sink = this.authService.getAuthenticatedUser().subscribe(
      (resp) => {
        this.userData = resp;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  getUserProfilePicture() {
    return this.userData?.profile_picture?.url
      ? `url(${this.userData.profile_picture.url})`
      : 'url(../../assets/images/default-user-profile.png)';
  }
}
