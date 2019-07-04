import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { OverviewComponent } from './overview/overview.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [SidebarComponent, OverviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    SharedModule
  ]
})
export class PoolModule { }
