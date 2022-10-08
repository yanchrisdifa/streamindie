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

  private subs = new SubSink();

  constructor(
    private menuItems: MenuItems,
    private authService: AuthService,
    private artistsService: ArtistsService
  ) {}

  ngOnInit(): void {
    this.menuList = this.menuItems.menus;
    this.getUserData();
  }

  logOut() {
    this.authService.logOut();
  }

  getUserProfilePicture() {
    return this.userData?.profile_picture?.url
      ? `url(${this.userData.profile_picture.url})`
      : 'url(../../assets/images/default-user-profile.png)';
  }

  getUserData() {
    this.subs.sink = this.artistsService
      .getAllArtists(
        `where:{id:{equals: "${this.authService.getLocalStorageUser()?.id}"}}`
      )
      .subscribe((data) => {
        console.log(data);
        this.userData = data[0];
      });
  }
}
