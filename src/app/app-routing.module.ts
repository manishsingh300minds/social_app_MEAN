import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";

const routes: Routes = [
  {
    path: '', redirectTo: 'dashboard',pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: (): any => import('./admin/admin.module').then((m) => m.AdminModule,
    ),
  },
  { path: 'auth/login', component: LoginComponent},
  { path: 'auth/signup', component: SignupComponent},
  { path: '**', loadChildren: (): any => import('./admin/admin.module').then((m) => m.AdminModule,)}
];

export const appRoutingModule = RouterModule.forRoot(routes);
