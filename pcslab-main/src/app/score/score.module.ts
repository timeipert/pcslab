import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewerComponent} from './viewer/viewer.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {SharedModule} from "../shared/shared.module";
import {AppRoutingModule} from "../app-routing.module";
import {NoteDragDirective} from "../directives/note-drag.directive";

@NgModule({
  declarations: [
    ViewerComponent,
    NoteDragDirective
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    SharedModule,
    AppRoutingModule
  ],
  exports: [
    ViewerComponent
  ]
})
export class ScoreModule {
}
