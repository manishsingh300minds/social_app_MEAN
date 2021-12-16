import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import {AngularMaterialModule} from "../angular-material.module";

import { AuthComponent } from "./auth.component";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import { routes } from "./auth-routing";

@NgModule({
    declarations: [
        AuthComponent,
        LoginComponent,
        SignupComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        HttpClientModule,
        AngularMaterialModule
    ],
    bootstrap: [AuthComponent]
})
export class AuthModule {}
