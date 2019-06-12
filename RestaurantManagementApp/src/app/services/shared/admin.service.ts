import { Injectable } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';

import {Table} from '../../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private toastr: ToastrManager) {}

  getTableName(tables: Table[], tableId: number) {
    const table = tables.find(x => x.Id === tableId);
    if (table === undefined)  {
      return '';
    }
    return table.Name;
  }

  checkPricingConditions(value: number) {
    if (value % 1 !== 0) {
      this.toastr.errorToastr('Value cannot be fractional', 'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      return false;
    }

    if (value <= 0) {
      this.toastr.errorToastr('Value cannot be negative or zero', 'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      return false;
    }
    return true;
  }

}
