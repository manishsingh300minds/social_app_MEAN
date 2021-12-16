import {Component, ViewEncapsulation} from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: 'login',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SignupComponent {
  cardTitle = 'Sign Up';

  constructor(private authService: AuthService) { }

    onSignup(form : NgForm):void{
    this.authService.createUser(form.value.email,form.value.password);
    form.reset();
  }
}
