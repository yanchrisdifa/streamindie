import { Component, OnInit } from '@angular/core';
import { SongsService } from 'src/app/core/services/songs.service';
import { MenuItems } from 'src/app/menu-items';
import { Menu } from 'src/app/menu-items.model';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  userData: any;
  menuList: Menu[];

  constructor(private menuItems: MenuItems, private authService: AuthService) {}

  ngOnInit(): void {
    this.menuList = this.menuItems.menus;
    this.userData = this.authService.getLocalStorageUser();
  }

  logOut() {
    this.authService.logOut();
  }

  getUserProfilePicture() {
    return this.userData?.image?.url
      ? `url(${this.userData.image.url})`
      : 'url(../../assets/images/default-user-profile.png)';
  }
}
