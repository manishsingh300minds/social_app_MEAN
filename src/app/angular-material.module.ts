import {NgModule} from "@angular/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
    exports: [
        MatPaginatorModule,
        MatDialogModule,
        MatSnackBarModule,
        MatIconModule
    ]
})
export class AngularMaterialModule{}
