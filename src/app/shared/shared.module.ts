import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';

import { SwiperModule } from 'swiper/angular';
import { NgScrollbarModule } from 'ngx-scrollbar';

const materialModules = [
  MatSidenavModule,
  MatListModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatDividerModule,
];

const libModule = [SwiperModule, NgScrollbarModule];

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, ...libModule, ...materialModules],
  exports: [HttpClientModule, ...libModule, ...materialModules],
})
export class SharedModule {}
