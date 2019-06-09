import {ActivatedRoute} from '@angular/router';
import { Component, OnInit } from '@angular/core';

import {Table} from '../../../models/table.model';

@Component({
  selector: 'app-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['./select-table.component.scss']
})
export class SelectTableComponent implements OnInit {
  tables: Table[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data: Table[]) => this.tables = data['tables'] );
  }

  getLastOrderSessionTimes(table: Table) {
    if (table.CurrentState === 'Empty') {
      return '';
    }

    const order = table.Orders.find(
      x => x.CurrentState === 'Ordered' || x.CurrentState === 'Served');
    const lastIndex = order.OrderSessions.length - 1;
    let orderedTime, servedTime;

    if (table.CurrentState === 'Ordered') {

      for (let i = 0; i < order.OrderSessions.length; i++) {
        if (order.OrderSessions[i].CurrentState === 'Ordered') {
          orderedTime = order.OrderSessions[i].OrderedDateTime;
          servedTime = '';
          break;
        }
      }
    } else {
      orderedTime = order.OrderSessions[lastIndex].OrderedDateTime;
      servedTime = order.OrderSessions[lastIndex].ServedDateTime;
    }
    return  { orderedTime: orderedTime, servedTime: servedTime };
  }
}
