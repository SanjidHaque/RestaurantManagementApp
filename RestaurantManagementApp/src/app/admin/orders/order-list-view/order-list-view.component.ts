import { Component, OnInit } from '@angular/core';
import {CashFlow} from '../../../shared/cash-flow';
import {ActivatedRoute, Router} from '@angular/router';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {IngredientServiceService} from '../../food-item/add-new-food-item/add-ingredients/ingredient-service.service';
import {Order} from '../../../shared/order.model';


@Component({
  selector: 'app-order-list-view',
  templateUrl: './order-list-view.component.html',
  styleUrls: ['./order-list-view.component.scss']
})
export class OrderListViewComponent implements OnInit {

  orderLists: Order[] = [];
  constructor(private route: ActivatedRoute,
              private router: Router,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private _ingredientService: IngredientServiceService) { }

  ngOnInit() {
    this._dataStorageService.getOrders()
      .subscribe(
        (order: Order[]) => {
          this._ourOfferService.ordersList = order;
        }
      );
    this.orderLists = this._ourOfferService.ordersList;
    this._ourOfferService.ordersListChanged
      .subscribe(
        (order: Order[]) => {
          this.orderLists = order;
        }
      );
  }
  viewDetails(orderList: Order) {
    const orderId =  orderList.Id;
    this.router.navigate(['admin/orders/list-details', orderId]);
  }

}
