import { Injectable } from '@angular/core';
import {CoordinatesService} from "./coordinates.service";
import {VerovioService} from "./verovio.service";
import {element} from "protractor";

@Injectable({
  providedIn: 'root'
})
export class NoteSelectService {
  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;
  vx = 0;
  vy = 0;
  dragActive = false;
  constructor(private coordinatesService: CoordinatesService, private verovioService: VerovioService) { }

  dragBegin(ev) {
    this.dragActive = true;
    this.x1 = ev.pageX;
    this.y1 = ev.pageY;
    return {x: this.x1, y: this.y1};
  }
  dragging(ev) {
      this.vx = ev.pageX;
      this.vy = ev.pageY;
      return {x: this.vx, y: this.vy};
  }
  dragEnd(ev, elementList) {
    this.x2 = ev.pageX;
    this.y2 = ev.pageY;
    this.vx = 0;
    this.vy = 0;
    this.dragActive = false;
    const selectedNotes = this.coordinatesService.selectAllInCoordinates(this.x1, this.x2, this.y1, this.y2);
    let next = [...elementList];
    selectedNotes.forEach(noteClick => {
      next = this.verovioService.noteClick(noteClick.event, noteClick.this, next);
    });

  }


}
