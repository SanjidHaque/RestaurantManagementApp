import { Component, OnInit } from '@angular/core';
import {Table} from '../../../models/table.model';
import {ActivatedRoute} from '@angular/router';

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

    } else if (table.CurrentState === 'Ordered') {
      const order = table.Orders.find(x => x.CurrentState === 'Ordered');
      const lastIndex = order.OrderSessions.length - 1;
      return 'Ordered at: ' + order.OrderSessions[lastIndex].OrderedDateTime;

    } else {
      const order = table.Orders.find(x => x.CurrentState === 'Served');
      const lastIndex = order.OrderSessions.length - 1;
      return 'Ordered at: ' + order.OrderSessions[lastIndex].OrderedDateTime +
        '\n' + 'Served at: ' + order.OrderSessions[lastIndex].ServedDateTime;
    }
  }







}
