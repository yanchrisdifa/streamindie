import { Component, OnInit } from '@angular/core';
import { SongsService } from 'src/app/core/services/songs.service';
import { MenuItems } from 'src/app/menu-items';
import { Menu } from 'src/app/menu-items.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  menuList: Menu[];

  constructor(private menuItems: MenuItems) {}

  ngOnInit(): void {
    this.menuList = this.menuItems.menus;
  }
}
