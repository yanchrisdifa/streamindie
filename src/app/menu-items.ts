import { Injectable } from '@angular/core';
import { Menu } from './menu-items.model';
@Injectable()
export class MenuItems {
  menus: Menu[] = [
    {
      state: '',
      name: 'Home',
      icon: 'home',
    },
    {
      state: 'categories',
      name: 'Categories',
      icon: 'category',
    },
    {
      state: 'library',
      name: 'Library',
      icon: 'library_music',
    },
    {
      state: 'popular',
      name: 'Popular',
      icon: 'stars',
    },
  ];
}
