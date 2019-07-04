import {Component} from '@angular/core';
import {IPool} from "../../interfaces/pool";
import {PoolService} from "../../services/pool/pool.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent {

  pools: IPool[];
  virtualPool = '';
  activePool: IPool;

  constructor(private poolService: PoolService) {
    this.poolService.getActivePool().subscribe(pool => this.activePool = pool);
    this.poolService.getPools().subscribe(pools => this.pools = pools);

    /*
    this.activePool$ = this.poolsService.getActivePool();
    this.activePool$.subscribe((pool) => {
      this.pools = this.poolsService.getPools();
      this.activePool = pool;
    });
    */

  }

  addPool() {
    this.poolService.addPool(this.virtualPool);
    this.virtualPool = '';
  }

  changeActivePool(pool) {
    this.poolService.setActivePool(pool);
  }


}
