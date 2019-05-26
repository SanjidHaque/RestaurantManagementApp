import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Order} from '../../../../models/order.model';
import {PointOfSaleService} from '../../../../services/shared/point-of-sale.service';



@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})

export class OrderListComponent implements OnInit {

  orders: Order[] = [];
  grossSale = 0;
  grossCost = 0;
  grossProfit = 0;
  totalOrder = 0;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private pointOfSaleService: PointOfSaleService,
              ) { }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: Order[]) => {
      //  this.pointOfSaleService.order = data['order'];
      }
    );


    for (let i = 0; i < this.orders.length; i++ ) {

      this.grossSale = this.grossSale
        + Number.parseInt(this.orders[i].TotalPrice.toString());

      this.grossCost = this.grossCost
        + Number.parseInt(this.orders[i].InventoryCost.toString());

      this.grossProfit = this.grossProfit
        + Number.parseInt(this.orders[i].Profit.toString());
    }


  }

  viewDetails(orderList: Order) {
    const orderId =  orderList.Id;
    this.router.navigate(['admin/order/food-item-details', orderId]);
  }
}
