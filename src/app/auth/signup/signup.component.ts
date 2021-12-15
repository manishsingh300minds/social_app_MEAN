import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";

@Component({
  selector: 'login',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SignupComponent implements OnInit {
  cardTitle = 'Sign Up';
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSignup(form : NgForm):void{
    console.log(form.value)
    this.authService.createUser(form.value.email,form.value.password).subscribe(res => {
      console.log("Response",res);
    });
  }
}
