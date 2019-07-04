import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {WebWorkerService} from 'ngx-web-worker';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SafePipe} from './safe.pipe';
import {SnackbarModule} from "ngx-snackbar";
import {FormsModule} from "@angular/forms";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

/* Font Awesome */
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons/faAngleLeft';
import {faSearchPlus} from '@fortawesome/free-solid-svg-icons/faSearchPlus';
import {library} from "@fortawesome/fontawesome-svg-core";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faSwimmingPool} from "@fortawesome/free-solid-svg-icons/faSwimmingPool";
import {faMinus} from "@fortawesome/free-solid-svg-icons/faMinus";
import {faAngleRight} from "@fortawesome/free-solid-svg-icons/faAngleRight";
import {faSearchMinus} from "@fortawesome/free-solid-svg-icons/faSearchMinus";
import {PoolModule} from "./pool/pool.module";
import {SharedModule} from "./shared/shared.module";
import {ScoreModule} from "./score/score.module";
import {FileModule} from "./file/file.module";
import { NoteDragDirective } from './directives/note-drag.directive';

@NgModule({
  declarations: [
    AppComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    SnackbarModule.forRoot(),
    FormsModule,
    FontAwesomeModule,
    PoolModule,
    ScoreModule,
    FileModule
  ],
  providers: [
    //{provide: ErrorHandler, useClass: GlobalErrorHandler},
    WebWorkerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(faTimes);
    library.add(faSwimmingPool);
    library.add(faPlus);
    library.add(faMinus);
    library.add(faAngleLeft);
    library.add(faAngleRight);
    library.add(faSearchMinus);
    library.add(faSearchPlus);
  }
}
