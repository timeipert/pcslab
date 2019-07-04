import {Component, HostBinding, OnInit} from '@angular/core';
import {IPool} from "../../interfaces/pool";
import {StorageService} from "../../services/storage.service";
import {PoolService} from "../../services/pool/pool.service";
import { TransformSetsService} from "../../services/transform-sets";
import {filter, map, switchMap, tap} from "rxjs/operators";
import {StoreSetsService} from "../../services/store-sets.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.sass']
})
export class OverviewComponent {


  @HostBinding('attr.class') hostClass = 'app-body';
  virtualSet = '';
  sets: any = [];
  activePool: IPool = {id: '', name: ''};
  storeKey;
  inputError = {error: '', errorMessage: ''};

  constructor(private storage: StorageService, private poolService: PoolService) {
    this.poolService.getActivePool().pipe(
      filter(activePool => !!activePool),
      tap(activePool => this.activePool = activePool),
      tap(_ => this.storeKey = this.poolService.getStoreKey(false)),
      switchMap(_ => this.poolService.getSetsOfActivePool())
    ).subscribe(storedSets => {
      console.log("New Sets arrived 31 overview", storedSets)
      this.sets = storedSets
    });
  }


  addPCS(input) {
    const out: any = this.poolService.addManualInputToPool(false, input);
    if (out && out.hasOwnProperty('error')) {
      throw(out);
      this.inputError = out;
    } else {
      //this.sets = out;
      this.virtualSet = '';
    }
  }

  deletePool(pool) {
    this.poolService.delete(pool);
  }

  onDelete(id) {
    this.sets.splice(id, 1);
    this.storage.set(this.storeKey, this.sets);
  }

}
