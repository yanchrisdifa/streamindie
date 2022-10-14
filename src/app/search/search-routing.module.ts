import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { SearchComponent } from './search.component';

const routes: Routes = [
  {
    path: ':searchText',
    component: SearchComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/app',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
