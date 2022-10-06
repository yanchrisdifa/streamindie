import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DesktopLayoutComponent } from './desktop-layout.component';
import { SharedModule } from '../core/shared/shared.module';
import { MenuItems } from '../menu-items';

@NgModule({
  declarations: [DesktopLayoutComponent],
  imports: [CommonModule, LayoutRoutingModule, SharedModule],
  exports: [DesktopLayoutComponent],
  providers: [MenuItems],
})
export class LayoutModule {}
