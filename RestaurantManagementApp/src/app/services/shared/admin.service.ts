import { Injectable } from '@angular/core';

import {Table} from '../../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  getTableName(tables: Table[], tableId: number) {
    const table = tables.find(x => x.Id === tableId);
    if (table === undefined)  {
      return '';
    }
    return table.Name;
  }

}
