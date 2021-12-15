import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public/public.component';
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
  { path: 'public', component: PublicComponent},
  { path: 'auth/login', component: LoginComponent},
  { path: 'auth/signup', component: SignupComponent},
  { path: '**', component: PublicComponent}
];

export const appRoutingModule = RouterModule.forRoot(routes);
