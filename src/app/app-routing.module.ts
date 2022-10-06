import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { DesktopLayoutComponent } from './layout/desktop-layout.component';
import { LoginModule } from './login/login.module';

const routes: Routes = [
  {
    path: 'app',
    component: DesktopLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'library',
        loadChildren: () =>
          import('./library/library.module').then((m) => m.LibraryModule),
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
