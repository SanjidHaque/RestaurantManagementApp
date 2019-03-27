import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OurOffersService} from '../../../services/our-offers.service';
import {Order} from '../../../models/order.model';


@Component({
  selector: 'app-order-list-view',
  templateUrl: './order-list-view.component.html',
  styleUrls: ['./order-list-view.component.scss']
})
export class OrderListViewComponent implements OnInit {

  orderLists: Order[] = [];
  grossSale = 0;
  grossCost = 0;
  grossProfit = 0;
  totalOrder = 0;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private ourOffersService: OurOffersService,
              ) { }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: Order[]) => {
        this.ourOffersService.orders = data['order'];
      }
    );
    this.orderLists = this.ourOffersService.orders;
    this.ourOffersService.ordersChanged
      .subscribe(
        (order: Order[]) => {
          this.orderLists = order;
        }
      );
    for (let i = 0; i < this.orderLists.length; i++ ) {

      this.grossSale = this.grossSale
        + Number.parseInt(this.orderLists[i].TotalPrice.toString());

      this.grossCost = this.grossCost
        + Number.parseInt(this.orderLists[i].InventoryCost.toString());

      this.grossProfit = this.grossProfit
        + Number.parseInt(this.orderLists[i].Profit.toString());
    }

    this.totalOrder = this.ourOffersService.orders.length;
  }

  viewDetails(orderList: Order) {
    const orderId =  orderList.Id;
    this.router.navigate(['admin/order/list-details', orderId]);
  }
}
