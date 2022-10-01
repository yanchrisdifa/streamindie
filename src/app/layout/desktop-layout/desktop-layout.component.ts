import { Component, OnInit } from '@angular/core';
import { SongsService } from 'src/app/core/services/songs.service';
import { MenuItems } from 'src/app/menu-items';
import { Menu } from 'src/app/menu-items.model';

@Component({
  selector: 'app-desktop-layout',
  templateUrl: './desktop-layout.component.html',
  styleUrls: ['./desktop-layout.component.scss'],
})
export class DesktopLayoutComponent implements OnInit {
  menuList: Menu[];

  constructor(private menuItems: MenuItems) {}

  ngOnInit(): void {
    this.menuList = this.menuItems.menus;
  }
}
