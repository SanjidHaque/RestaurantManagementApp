import { Component, OnInit } from '@angular/core';
import {CashFlow} from '../../../shared/cash-flow';
import {ActivatedRoute, Router} from '@angular/router';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {IngredientServiceService} from '../../food-item/add-new-food-item/add-ingredients/ingredient-service.service';
import {Order} from '../../../shared/order.model';
import {Subject} from 'rxjs/Subject';


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
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private _ingredientService: IngredientServiceService) { }

  ngOnInit() {
    /*this._dataStorageService.getOrders()
      .subscribe(
        (order: Order[]) => {
          this._ourOfferService.ordersList = order;
        }
      );*/
    this.route.data.
    subscribe(
      ( data: Order[]) => {
        this._ourOfferService.ordersList = data['orders'];
      }
    );
    this.orderLists = this._ourOfferService.ordersList;
    this._ourOfferService.ordersListChanged
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

    this.totalOrder = this.orderLists.length;
  }
  viewDetails(orderList: Order) {
    const orderId =  orderList.Id;
    this.router.navigate(['admin/orders/list-details', orderId]);
  }



}
