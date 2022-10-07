import { Injectable } from '@angular/core';
import { Menu } from './menu-items.model';
@Injectable()
export class MenuItems {
  menus: Menu[] = [
    {
      state: '/app',
      name: 'Home',
      icon: 'home',
    },
    {
      state: '/app/my-music',
      name: 'My Music',
      icon: 'music_note',
    },
    {
      state: '/app/library',
      name: 'Library',
      icon: 'library_music',
    },
  ];
}
