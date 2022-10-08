import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDetailsRoutingModule } from './user-details-routing.module';
import { UserDetailsComponent } from './user-details.component';
import { SharedModule } from '../core/shared/shared.module';

@NgModule({
  declarations: [UserDetailsComponent],
  imports: [CommonModule, UserDetailsRoutingModule, SharedModule],
})
export class UserDetailsModule {}
