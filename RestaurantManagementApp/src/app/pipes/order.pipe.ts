import { Pipe, PipeTransform } from '@angular/core';
import {Order} from '../models/order.model';

@Pipe({
  name: 'order'
})
export class OrderPipe implements PipeTransform {

  transform(orderLists: any, term: any): any {
    if (term === undefined) {
      return orderLists;
    }
    return orderLists.filter(function (orderList) {
      return orderList.Id.toLowerCase()
        .includes(term.toLowerCase());
    })
  }

}
