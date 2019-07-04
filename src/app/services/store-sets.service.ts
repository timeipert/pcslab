import { Injectable } from '@angular/core';
import {filter, switchMap} from "rxjs/operators";
import {IPool} from "../interfaces/pool";
import {IIDSet} from "../interfaces/set";
import {PoolService} from "./pool/pool.service";
import {StorageService} from "./storage.service";
import {IPitchClassSet} from "pitchclassjs";
import {TransformSetsService} from "./transform-sets";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StoreSetsService {



  constructor( private storage: StorageService, private transformSets: TransformSetsService) {

  }


  storeSet(storeKey: string, set: IPitchClassSet, id: string[], virtual: boolean, sets_: IIDSet[]) {
    const sets = [...sets_];
    if (!virtual) {
      sets.push({id, set: set as IPitchClassSet, color: this.transformSets.randomColor()});
      this.storage.set(storeKey, sets);
    } else {
      this.storage.set(storeKey, [{id, set: set as IPitchClassSet, color: this.transformSets.randomColor()}]);
    }
    return sets;
  }

  addPCS(input: any, storeKey: string, id: any = -1, alreadyPitchClass: boolean = false, virtual: boolean = false, sets_) {
    if (alreadyPitchClass) {
      input = input.map((e) => e.class).join(',');
    }
    const parserOutput = this.transformSets.parseSet(input, sets_);
    if (parserOutput.hasOwnProperty('error')) {
      return parserOutput as IPCSInputError;
    } else {
      console.log("addPCS: %s, %o, %s, %s", storeKey, parserOutput, id, virtual);
      return this.storeSet(storeKey, parserOutput as IPitchClassSet, id, virtual, sets_);
    }
  }


}
