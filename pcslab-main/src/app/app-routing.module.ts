import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OverviewComponent} from "./pool/overview/overview.component";
import {ViewerComponent} from "./score/viewer/viewer.component";
import {UploadComponent} from "./file/upload/upload.component";

const routes: Routes = [
  {path: '', redirectTo: 'pools', pathMatch: 'full'},
  {path: 'pools', component: OverviewComponent},
  {path: 'scores', component: ViewerComponent},
  {path: 'upload', component: UploadComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
