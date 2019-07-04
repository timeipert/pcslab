import {Injectable} from '@angular/core';
import {IPitchClassSet, pitchClassSetFromArray, p, pitchClassFrom} from "pitchclassjs/dist/index";
import {PitchClass} from "pitchclassjs/dist/PitchClass/pitch";
import {INoteElement} from "../interfaces/noteElement";

@Injectable({
  providedIn: 'root'
})
export class TransformSetsService {


  constructor() {

  }

  randomColor() {
    let length = 6;
    const chars = '0123456789ABCDEF';
    let hex = '#';
    while (length--) {
      // tslint:disable-next-line:no-bitwise
      hex += chars[(Math.random() * 16) | 0];
    }
    return hex;
  }

  isDuplicate = (ar) => !ar.reduce((state, element, i) => ar.indexOf(element) !== i ? false : state, true);
  isFalseRange = (ar) => !ar.reduce((state, element) => +element > -1 && +element < 12 ? state : false, true);
  isFalseChar = (ar) => !ar.reduce((state, element) => /^1?[0-9]$/.test(element) ? state : false, true);
  areSetsNotEqual = (ar1, ar2) => ar2.reduce((state, set) => ar1.join() === set.set.pcs.map(d => d.class)
    .join() ? true : state, false);

  parseSet(input: string, sets): IPitchClassSet | IPCSInputError {
    console.log(sets);
    const splitted = input.split(',');
    if (this.isDuplicate(splitted)) {
      return {errorMessage: 'Pitch class duplication!', error: true};
    }
    if (this.isFalseChar(splitted)) {
      return {errorMessage: 'There are wrong characters. Only numbers (0-11) and seperator (,) allowed.', error: true};
    }
    if (this.isFalseRange(splitted)) {
      return {errorMessage: 'Wrong range of pitch classes!', error: true};
    }
    if (this.areSetsNotEqual(splitted, sets)) {
      return {errorMessage: 'Set already exists!', error: true};
    }

    const pcs = splitted.map((c) => p(+c as unknown as PitchClass));
    return pitchClassSetFromArray(pcs);
  }


  getIDSet(noteElementList: INoteElement[]) {
    const noteIDs = noteElementList.map(e => e.id);
    const pitchClassList = noteElementList.map((el) => {
      return pitchClassFrom({
        name: el.pname as any,
        octave: el.oct as any,
        duration: 0,
        accidentals: el.accid as any
      });
    }).map((pc) => pc.class)
      .filter((pitchClass, index, arr) => arr.indexOf(pitchClass) !== index ? false : true)
      .map((pc) => p(pc));

    return {noteIDs, pitchClassList}
  }

}
