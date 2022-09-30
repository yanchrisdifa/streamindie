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
import { MatTooltipModule } from '@angular/material/tooltip';

import { SwiperModule } from 'swiper/angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SongTitleSeparator } from './pipes/song-title-separator.pipe';

const materialModules = [
  MatSidenavModule,
  MatListModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatDividerModule,
  MatTooltipModule,
];

const libModule = [SwiperModule, NgScrollbarModule];

const pipes = [SongTitleSeparator];

@NgModule({
  declarations: [...pipes],
  imports: [CommonModule, HttpClientModule, ...libModule, ...materialModules],
  exports: [HttpClientModule, ...libModule, ...materialModules, ...pipes],
})
export class SharedModule {}