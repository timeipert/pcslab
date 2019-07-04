import {Injectable} from '@angular/core';
import {INoteCoordinate} from "../../interfaces/noteCoordinate";
import {Subject} from "rxjs";

declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class CoordinatesService {

  coordinatesPerNote$ = new Subject<INoteCoordinate[]>();
  coordinatesPerNote: INoteCoordinate[];

  constructor() {
    this.coordinatesPerNote$.subscribe((coordinates) => {
      this.coordinatesPerNote = coordinates;
    });
  }

  computeCoordinates() {
    const ngThis = this;
    const result = [];
    $('.note').each(function () {
      result.push({id: $(this).attr('id'), offset: $(this).offset(), $this: this});
    }).promise().done((() => {
      this.coordinatesPerNote$.next(result);
    }));
  }

  selectAllInCoordinates(x1, x2, y1, y2) {
       return this.coordinatesPerNote.map(note => {
         if (note.offset.left > x1 &&
           note.offset.left < x2 &&
           note.offset.top > y1 &&
           note.offset.top < y2) {
           return {event: {currentTarget: {id: note.id}}, this: '#' + note.id, elementList: this};
         }

       }).filter(d => d);
   }

}
