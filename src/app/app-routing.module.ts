import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: 'dashboard',pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: (): any => import('./feature/feature.module').then((m) => m.FeatureModule,
    ),
  },
  {
    path: 'auth',
    loadChildren: (): any => import('./auth/auth.module').then((m) => m.AuthModule,
    ),
  },
  { path: '**', loadChildren: (): any => import('./feature/feature.module').then((m) => m.FeatureModule,)}
];

export const appRoutingModule = RouterModule.forRoot(routes);
