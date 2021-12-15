import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,OnDestroy {
  private authSubs!: Subscription;
  previousId = 'list';
  isAuthenticated = false;

  constructor(public router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuth();
    this.authSubs = this.authService.getAuthStatusListener().subscribe( authValue => {
      this.isAuthenticated = authValue;
    });
  }

  ngOnDestroy(): void {
    this.authSubs.unsubscribe();
  }

  // To change the text effect of active nav tab
  changePage(event : Event){
    const elementId: string = (event.target as Element).id;
    const element = document.getElementById(elementId);
    const previousElement = document.getElementById(this.previousId);
    if(previousElement)
      previousElement.classList.remove('active');
    if(element)
      element.classList.add('active');
    this.previousId = elementId;
  }

  logout(){
    this.authService.logoutUser();
  }
}
