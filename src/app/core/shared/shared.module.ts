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
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';

import { SwiperModule } from 'swiper/angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SongTitleSeparator } from './pipes/song-title-separator.pipe';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserMusicComponent } from './components/user-music/user-music.component';

const materialModules = [
  MatSidenavModule,
  MatListModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatDividerModule,
  MatTooltipModule,
  MatMenuModule,
  MatTableModule,
  MatDialogModule,
];

const libModule = [SwiperModule, NgScrollbarModule, ReactiveFormsModule];

const pipes = [SongTitleSeparator];

const components = [
  AudioPlayerComponent,
  UserProfileComponent,
  UserMusicComponent,
];

@NgModule({
  declarations: [...pipes, ...components],
  imports: [CommonModule, HttpClientModule, ...libModule, ...materialModules],
  exports: [
    HttpClientModule,
    ...libModule,
    ...materialModules,
    ...pipes,
    ...components,
  ],
})
export class SharedModule {}
