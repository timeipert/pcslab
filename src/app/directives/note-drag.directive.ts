import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {CoordinatesService} from "../services/viewer/coordinates.service";
import {NoteSelectService} from "../services/viewer/note-select.service";

@Directive({
  selector: '[appNoteDrag]'
})
export class NoteDragDirective {

  @Input('elementList') elementList;

  constructor(private noteSelectService: NoteSelectService, private el: ElementRef) {
  }

  selectionTopLeftPoint = {x: 0, y: 0};
  selectionBottomRightPoint = {x: 0, y: 0};

  @HostListener('mousedown', ['$event']) onMouseDown(ev) {
    if (!ev.shiftKey) {
      return false;
    }
    ev.preventDefault();
    this.selectionTopLeftPoint = this.noteSelectService.dragBegin(ev)
    this.el.nativeElement.firstChild.style.display = 'block';
    this.el.nativeElement.firstChild.style.top = `${this.selectionTopLeftPoint.y}px`;
    this.el.nativeElement.firstChild.style.left = `${this.selectionTopLeftPoint.x}px`;
  }

  @HostListener('mousemove', ['$event']) onMouseMove(ev) {
    if (this.noteSelectService.dragActive) {
      this.selectionBottomRightPoint = this.noteSelectService.dragging(ev);
      const selectionWidth = this.selectionBottomRightPoint.x - this.selectionTopLeftPoint.x;
      const selectionHeight = this.selectionBottomRightPoint.y - this.selectionTopLeftPoint.y;
      this.el.nativeElement.firstChild.style.width = `${selectionWidth}px`;
      this.el.nativeElement.firstChild.style.height = `${selectionHeight}px`;
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(ev) {
    this.el.nativeElement.firstChild.style.display = 'none';
    if (!ev.shiftKey) {
      return false;
    }
    // $(this).off('mousemove');
    ev.preventDefault();
    this.el.nativeElement.firstChild.style.top = `0px`;
    this.el.nativeElement.firstChild.style.left = `0px`;
    this.el.nativeElement.firstChild.style.width = `0px`;
    this.el.nativeElement.firstChild.style.height = `0px`;
    this.noteSelectService.dragEnd(ev, this.elementList);
  }

}
