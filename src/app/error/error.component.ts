import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'auth-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ErrorComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public errorInterceptor: {message : string}, private dialog: MatDialog ) {}

  closeDialog(){
    this.dialog.closeAll();
  }
}
