import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyMusicRoutingModule } from './my-music-routing.module';
import { MyMusicComponent } from './my-music.component';
import { SharedModule } from '../core/shared/shared.module';

@NgModule({
  declarations: [MyMusicComponent],
  imports: [CommonModule, SharedModule, MyMusicRoutingModule],
})
export class MyMusicModule {}
