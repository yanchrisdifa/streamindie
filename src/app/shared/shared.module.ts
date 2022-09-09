import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';

const materialModule = [MatSidenavModule];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...materialModule],
})
export class SharedModule {}
