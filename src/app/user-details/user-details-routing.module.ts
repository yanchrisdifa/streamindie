import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailsComponent } from './user-details.component';

const routes: Routes = [
  {
    path: ':id',
    component: UserDetailsComponent,
  },
  { path: '', redirectTo: 'app', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDetailsRoutingModule {}
