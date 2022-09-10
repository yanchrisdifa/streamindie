import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DesktopLayoutComponent } from './desktop-layout/desktop-layout.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DesktopLayoutComponent],
  imports: [CommonModule, LayoutRoutingModule, SharedModule],
  exports: [DesktopLayoutComponent],
})
export class LayoutModule {}
