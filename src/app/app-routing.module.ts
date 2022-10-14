import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginModule } from './login/login.module';

const routes: Routes = [
  {
    path: 'app',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'my-music',
        loadChildren: () =>
          import('./my-music/my-music.module').then((m) => m.MyMusicModule),
      },
      {
        path: 'library',
        loadChildren: () =>
          import('./library/library.module').then((m) => m.LibraryModule),
      },
      {
        path: 'details',
        loadChildren: () =>
          import('./user-details/user-details.module').then(
            (m) => m.UserDetailsModule
          ),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchModule),
      },
    ],
  },
  {
    path: 'session',
    loadChildren: () => import('./login/login.module').then((m) => LoginModule),
  },
  { path: '**', redirectTo: 'app', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class RoutingModule {}
