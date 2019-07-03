import { Injectable } from '@angular/core';
import {StorageService} from "./storage.service";
import {IPool} from "../interfaces/pool";
import {Observable} from "rxjs";
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class PoolService {

  activePool: IPool;
  activePool$;
  pools = [];
  pools$;


  constructor(private storage: StorageService) {
    this.activePool$ = this.storage.select('activePool', {name: '', id: ''});
    this.activePool$.subscribe(pool => this.activePool = pool);
    this.pools$ = this.storage.select('pools', []);
    this.pools$.subscribe(pools => this.pools = pools);
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
}
