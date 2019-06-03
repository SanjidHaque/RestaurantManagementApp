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




  getLastOrderSessionTimes(table: Table, timeType: string) {
    const order = table.Orders.find(x => x.TableId === table.Id);

    if (table.CurrentState === 'Empty') {
      return '';

    } else if (timeType === 'Ordered') {
      const lastIndex = order.OrderSessions.length - 1;
      return order.OrderSessions[lastIndex].OrderedDateTime;

    } else {

      const lastIndex = order.OrderSessions.length - 1;
      return order.OrderSessions[lastIndex].ServedDateTime;
    }
  }

}
