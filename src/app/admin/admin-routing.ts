import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CreateComponent } from './create/create.component';
import { ListingComponent } from './listing/listing.component';
import {AuthGuard} from "../guard/auth.guard";

export const routes: Routes = [
  { path:'', component: AdminComponent, children: [
    { path: '', redirectTo: 'listing', pathMatch: 'full' },
    { path: 'listing', component: ListingComponent},
    { path: 'create', component: CreateComponent, canActivate: [AuthGuard]},
    { path: 'edit', component: CreateComponent, canActivate: [AuthGuard]},
  ]},
];

export const components = [AdminComponent];
