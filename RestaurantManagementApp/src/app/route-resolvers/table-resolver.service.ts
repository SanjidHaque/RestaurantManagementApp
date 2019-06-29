import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import {TableDataStorageService} from '../services/data-storage/table-data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TableResolverService implements Resolve<any> {

  constructor(private tableDataStorageService: TableDataStorageService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.tableDataStorageService.getTable(+route.paramMap.get('table-id'));
  }

}
