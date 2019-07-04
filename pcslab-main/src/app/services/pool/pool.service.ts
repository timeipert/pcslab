import { Injectable } from '@angular/core';
import {StorageService} from "../storage.service";
import {IPool} from "../../interfaces/pool";
import {Observable} from "rxjs";
import * as uuid from 'uuid';
import {TransformSetsService} from "../transform-sets";
import {StoreSetsService} from "../store-sets.service";
import {filter, switchMap, tap} from "rxjs/operators";
import {IIDSet} from "../../interfaces/set";
import {INoteElement} from "../../interfaces/noteElement";

@Injectable({
  providedIn: 'root'
})
export class PoolService {

  activePool: IPool;
  activePool$;
  pools = [];
  pools$;

  sets;
  sets$;

  storeKey;



  constructor(private storage: StorageService, private transformSetsService: TransformSetsService, private storeSetsService: StoreSetsService) {
    this.activePool$ = this.storage.select('activePool', {name: '', id: ''});
    this.activePool$.subscribe(pool => this.activePool = pool);
    this.pools$ = this.storage.select('pools', []);
    this.pools$.subscribe(pools => this.pools = pools);

    this.activePool$.pipe(
      filter(activePool => !!activePool),
      tap((activePool: IPool) => this.storeKey = `sets-overview-${activePool.id}`),
      switchMap(_ => {
          this.sets$ = this.storage.select(
            this.storeKey,
            []
          );
          return this.sets$;
        }
      )).subscribe(storedSets => this.sets = storedSets as IIDSet[]);
  }

  addNoteSelectionToPool(virtual = false, noteElementList: INoteElement[]) {
    const storeKey: string = this.getStoreKey(virtual);
    const {noteIDs, pitchClassList} = this.transformSetsService.getIDSet(noteElementList);
    const out = this.storeSetsService.addPCS(pitchClassList, storeKey, noteIDs, true, virtual, this.sets);
    if (out && out.hasOwnProperty('error')) {
       return out as IPCSInputError;
    } else {
      return true;
    }
  }

  addManualInputToPool(virtual = false, input) {
    this.storeSetsService.addPCS(input, this.storeKey, -1, false, false, this.sets);
    return true;
  }

  getPools() {
      return this.pools$;
  }
  addPool(name: string) {
      const pool = {id: uuid.v4(), name};
      this.pools.push(pool);
      this.storage.set('pools', this.pools);
      this.setActivePool(pool);

  }

  getStoreKey(virtual = false) {
    if (!virtual) {
      return 'sets-overview-' + this.activePool.id;
    } else {
      return 'sets-overview-virtual';
    }
  }

  delete(pool: IPool) {
    this.pools = this.pools.filter(p => p.id !== pool.id);
    this.storage.remove('sets-overview-' + pool.id);
    this.storage.set('pools', this.pools);
    this.storage.set('activePool', {id: '', name: ''});
  }
  getActivePool(): Observable<IPool> {
    return this.activePool$;
  }
  setActivePool(pool: IPool) {
    this.storage.set('activePool', pool);
  }

  getSetsOfActivePool() {
    return this.sets$;
  }
}
