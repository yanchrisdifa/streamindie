import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { SwiperModule } from 'swiper/angular';

const materialModules = [
  MatSidenavModule,
  MatListModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
];

const libModule = [SwiperModule];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...libModule, ...materialModules],
  exports: [...libModule, ...materialModules],
})
export class SharedModule {}
