import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  findPrimeForm,
  IIntervalClassVector,
  intervalClassContentFromSet, intervalClassVectorFromContent,
  IPitchClass,
  IPitchClassSet,
  p
} from "pitchclassjs/dist/index";

@Component({
  selector: 'app-pcset-card',
  templateUrl: './pcset-card.component.html',
  styleUrls: ['./pcset-card.component.sass']
})
export class PcsetCardComponent implements OnInit {
  @Input() pcset: IPitchClassSet = {pcs: [], normalForm: []};
  @Input() color = '#fff';
  @ViewChild('cardheader', {static: false}) cardheader;
  @Output() delete = new EventEmitter<boolean>();

  primeform: IPitchClass[] = []
  icv: IIntervalClassVector = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
  icvValues = '';
  icvAsPC = [];

  constructor() {
  }

  ngAfterViewInit() {
    this.cardheader.nativeElement.setAttribute('style', 'background-color: ' + this.color +
      ' !important;');
  }

  findEverything() {
    this.primeform = findPrimeForm(this.pcset.normalForm);
    this.icv = intervalClassVectorFromContent(intervalClassContentFromSet(this.pcset));
    this.icvAsPC = Object.keys(this.icv).map(key => p(this.icv[key]));
    this.icvValues = Object.keys(this.icv).map(key => this.icv[key]).join('');
  }

  ngOnInit() {
    this.findEverything();
  }

  ngOnChanges() {
    this.findEverything();
  }

  primeView(primeForm) {
    return '(' + primeForm.map(pc => pc.class).join('') + ')';
  }

  pcsView(pcs, mode = 'pcs') {
    return '[' + pcs[mode].map((pc, i) => i + 1 !== pcs.length ? pc.class : pc.class + ',').join() + ']';
  }

  deleteSet() {
    this.delete.emit(true);
  }

}
