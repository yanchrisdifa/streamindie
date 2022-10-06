import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../core/shared/shared.module';
import { MenuItems } from '../menu-items';

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, LayoutRoutingModule, SharedModule],
  exports: [LayoutComponent],
  providers: [MenuItems],
})
export class LayoutModule {}
