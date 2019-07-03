import {Component, HostBinding, OnInit} from '@angular/core';
import {IPool} from "../../interfaces/pool";
import {StorageService} from "../../services/storage.service";
import {PoolService} from "../../services/pool.service";
import {PcsetService} from "../../services/pcset.service";
import {filter, map, switchMap, tap} from "rxjs/operators";

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

  constructor(private storage: StorageService, private poolService: PoolService, private setsService: PcsetService) {
    this.poolService.getActivePool().pipe(
      filter(activePool => !!activePool),
      tap(activePool => this.activePool = activePool),
      tap(_ => this.storeKey = this.poolService.getStoreKey(false)),
      switchMap(_ => this.setsService.getSets())
    ).subscribe(storedSets => this.sets = storedSets);

    /*this.poolService.getActivePool().subscribe((activePool) => {
      this.activePool = activePool;
      this.storeKey = 'sets-overview-' + activePool.id;
      if (this.activePool.id !== '') {
        this.setsService.getSets().subscribe((storedSets) => {
          this.sets = storedSets;
        });
      }
    });*/
  }


  addPCS(input) {
    const out: any = this.setsService.addPCS(input, this.storeKey, this.sets);
    if (out && out.hasOwnProperty('error')) {
      throw(out);
      this.inputError = out;
    } else {
      this.sets = out;
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
