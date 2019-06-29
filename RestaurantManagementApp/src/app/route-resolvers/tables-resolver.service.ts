import {Observable} from 'rxjs';
import {Resolve} from '@angular/router';
import { Injectable } from '@angular/core';

import {Table} from '../models/table.model';
import {TableDataStorageService} from '../services/data-storage/table-data-storage.service';

@Injectable()
export class TablesResolverService implements Resolve<Table[]> {

  constructor(private tableDataStorageService: TableDataStorageService) { }

  resolve(): Observable<Table[]> | Promise<Table[]> | Table[] {
    return this.tableDataStorageService.getAllTable();
  }
}


