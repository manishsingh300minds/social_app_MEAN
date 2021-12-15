import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LoginComponent implements OnInit {
  cardTitle = 'Login';
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onLogin(form : NgForm):void{
    console.log("Login",form.value);
    this.authService.loginUser(form.value.email,form.value.password);
  }
}
