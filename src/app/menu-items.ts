import { Injectable } from '@angular/core';

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  icon?: string;
  permissions?: string;
}

export interface Menu {
  state: string;
  name: string;
  type?: string;
  icon?: string;
  children?: ChildrenItems[];
  permissions?: string;
}

@Injectable()
export class MenuItems {
  menus: Menu[] = [
    {
      state: '',
      name: 'Home',
      icon: 'home',
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
