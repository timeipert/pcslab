import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleIntVisualizerComponent } from './simple-int-visualizer/simple-int-visualizer.component';
import { PcsetCardComponent } from './pcset-card/pcset-card.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [SimpleIntVisualizerComponent, PcsetCardComponent],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    CommonModule, SimpleIntVisualizerComponent, PcsetCardComponent
  ]
})
export class SharedModule {}
