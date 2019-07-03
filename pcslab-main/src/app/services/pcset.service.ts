import { Injectable } from '@angular/core';
import {StorageService} from "./storage.service";
import {PoolService} from "./pool.service";
import {filter, switchMap} from "rxjs/operators";
import {IPitchClassSet, pitchClassSetFromArray, p, pitchClassFrom} from "pitchclassjs/dist/index";
import {PitchClass} from "pitchclassjs/dist/PitchClass/pitch";
import {IPool} from "../interfaces/pool";
import {INoteElement} from "../interfaces/noteElement";

@Injectable({
  providedIn: 'root'
})
export class PcsetService {

  inputError: IPCSInputError = {errorMessage: '', error: false};
  sets: any;
  activePool;
  sets$;

  constructor(private storage: StorageService, private poolService: PoolService) {

    this.poolService.getActivePool().pipe(
      filter(activePool => !!activePool),
      switchMap((activePool: IPool) => {
        this.sets$ = this.storage.select(
          `sets-overview-${activePool.id}`,
          []
        );
        return this.sets$;
      }
      )).subscribe(storedSets => this.sets = storedSets);
  }
/**
    this.poolService.getActivePool().subscribe((activePool) => {
      this.activePool = activePool;
      if (this.activePool.id !== '') {
        this.storeKey = 'sets-overview-' + this.activePool.id;
        this.sets$ = this.storage.select(this.storeKey, []);
        this.sets$.subscribe((storedSets) => {
          this.sets = storedSets;
        });
      }
    });
  }
 */

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


  storeSet(storeKey, set, id, virtual) {
    const sets = [...this.sets];
    if (!virtual) {
      sets.push({id, set: set as IPitchClassSet, color: this.randomColor()});
      this.storage.set(storeKey, sets);
    } else {
      this.storage.set(storeKey, [{id, set: set as IPitchClassSet, color: this.randomColor()}]);
    }
    return sets;
  }

  addPCS(input: any, storeKey: string, id: any = -1, alreadyPitchClass: boolean = false, virtual: boolean = false) {
    if (alreadyPitchClass) {
      input = input.map((e) => e.class).join(',');
    }
    const parserOutput = this.parseSet(input, this.sets);
    if (parserOutput.hasOwnProperty('error')) {
      return parserOutput as IPCSInputError;
    } else {
      console.log("addPCS: %s, %o, %s, %s", storeKey, parserOutput, id, virtual);
      return this.storeSet(storeKey, parserOutput, id, virtual);
    }
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
    });
    return {noteIDs, pitchClassList}
  }

  getSets() {
    return this.sets$;
  }
}
