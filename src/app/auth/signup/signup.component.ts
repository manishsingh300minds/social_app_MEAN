import {Component, ViewEncapsulation} from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from "../auth.service";

@Component({
  selector: 'login',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SignupComponent {
  cardTitle = 'Sign Up';

  constructor(private authService: AuthService,private router: Router) { }

    onSignup(form : NgForm):void{
    this.authService.createUser(form.value.email,form.value.password);
    form.reset();
  }
}
