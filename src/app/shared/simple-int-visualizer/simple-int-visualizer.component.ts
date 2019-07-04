import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {IPitchClass} from "pitchclassjs/dist/index";

@Component({
  selector: 'app-simple-int-visualizer',
  templateUrl: './simple-int-visualizer.component.html',
  styleUrls: ['./simple-int-visualizer.component.sass']
})
export class SimpleIntVisualizerComponent implements OnInit, OnChanges {
  @Input() pitchclasses: IPitchClass[] = [];
  @Input() svgWidth = 200;
  @Input() svgHeight = 50;
  @Input() yAxis = 12;
  pcsClasses = [];
  marginX = 10;
  marginY = 10;
  innerWidth;
  innerHeight;
  scaleX;
  scaleY;
  points = [];

  constructor() {
  }

  ngOnInit() {
    if (this.pitchclasses.length) {
      this.init();
    }
  }

  ngOnChanges() {
    if (this.pitchclasses.length) {
      this.init();
    }
  }

  init() {
    this.pcsClasses = this.pitchclasses.map(pc => pc.class);
    this.innerHeight = (this.svgHeight - this.marginY * 2);
    this.innerWidth = (this.svgWidth - this.marginX * 2);
    this.scaleX = this.innerWidth / (this.pcsClasses.length + 1);
    this.scaleY = this.innerHeight  / this.yAxis;
    this.points = this.pcsClasses.map((y, x) =>  [(x + 1) * this.scaleX, this.innerHeight - (y + 1) * this.scaleY]);
  }

  lineCommand(point) {
    return `L ${point[0]} ${point[1]}`;
  }

  svgPath(points, command) {
        return points.reduce((acc, point, i, a) => i === 0
            ? `M ${point[0]},${point[1]}`
            : `${acc} ${command(point, i, a)}`
      , '');
  }

  line(pointA, pointB) {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    };
  }

  controlPoint(current, previous, next, reverse) {
    const p = previous || current;
    const n = next || current;
    const smoothing = 0.2;
    const o = this.line(p, n);
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;
    const x = current[0] + Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;
    return [x, y];
  }

  bezierCommand(point, i, a) {
    const [cpsX, cpsY] = this.controlPoint(a[i - 1], a[i - 2], point, false);
    const [cpeX, cpeY] = this.controlPoint(point, a[i - 1], a[i + 1], true);
    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
  }
}
