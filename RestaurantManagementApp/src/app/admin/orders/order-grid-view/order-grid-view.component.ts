import { Component, OnInit } from '@angular/core';
import {OurOffersService} from '../../../services/our-offers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Order} from '../../../models/order.model';

@Component({
  selector: 'app-order-grid-view',
  templateUrl: './order-grid-view.component.html',
  styleUrls: ['./order-grid-view.component.scss']
})
export class OrderGridViewComponent implements OnInit {

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
    this.router.navigate(['admin/order/grid-details', orderId]);
  }

}
