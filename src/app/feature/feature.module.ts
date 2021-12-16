import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'

import { FeatureComponent } from "./feature.component";
import { ListingComponent } from "./listing/listing.component";
import { CreateComponent } from "./create/create.component";

import { routes } from "./feature-routing";
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
    declarations: [
        FeatureComponent,
        ListingComponent,
        CreateComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbAlertModule,
        MatPaginatorModule
    ],
    bootstrap: [FeatureComponent]
})
export class FeatureModule {}
