import { Injectable } from '@angular/core';
import { Uuid } from 'ng2-uuid';
import {SummaryOfInventory} from '../../../../shared/summary-of-inventory';
import {Subject} from 'rxjs/Subject';
import {CashFlow} from '../../../../shared/cash-flow';

@Injectable()
export class IngredientServiceService {

  summaryOfInventories: SummaryOfInventory[] = [];
  summaryOfInventoriesChanged = new Subject<SummaryOfInventory[]>();

  cashFlow: CashFlow[] = [];
  cashFlowChanged = new Subject<CashFlow[]>();

  uuidCodeOne = '';

  constructor(private uuid: Uuid,
  ) { this.uuidCodeOne = this.uuid.v1(); }

}
