import { Injectable } from '@angular/core';
import {Table} from '../models/table.model';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {TableDataStorageService} from '../services/table-data-storage.service';

@Injectable()
export class TableResolverService implements Resolve<Table[]> {

  constructor(private tableDataStorageService: TableDataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Table[]> |
      Promise<Table[]> | Table[] {
    return this.tableDataStorageService.getAllTable();
  }

}


