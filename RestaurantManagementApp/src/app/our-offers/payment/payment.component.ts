import {Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStorageService} from '../../shared/data-storage.service';
import {OurOffersService} from '../our-offers.service';
import {Order} from '../../shared/order.model';
import { Response } from '@angular/http';
import {OrderedItems} from '../../shared/ordered-items.model';
import { Uuid } from 'ng2-uuid';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, DoCheck {

  grandTotal : number;
  public orderedItems: OrderedItems[];
  public orders: Order;
  onCheck = 0;
  tendered: number;
  change = 0;

  constructor(private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private router: Router,
              private route: ActivatedRoute,
              private uuid: Uuid) {
    this.tendered = 0;
  }

  ngOnInit() {
    this.grandTotal = this._ourOfferService.TotalPrice;

  }

  ngDoCheck() {

  }

  back() {
      this.router.navigate(['our-offers']);
  }

  checkCertainAmount() {
    if (this.tendered < this.grandTotal || this.grandTotal === 0 ) {
      return false;
    } else {
      return true;
    }
  }

  checkCertainChange() {
    if (this.tendered < this.grandTotal || this.tendered === 0 ) {
      return false;
    } else {
      return true;
    }
  }



  validate() {
    let orderId = this._ourOfferService.uuidCodeOne;
    this.onCheck  = 1;
    this.orderedItems = this._ourOfferService.orderedItems;
    let totalPrice = this._ourOfferService.TotalPrice;
    let orderStatus = 0;
    this.change = Number.parseInt(this.tendered.toString())
      - Number.parseInt(totalPrice.toString());
    const dateTime = new Date().toLocaleString();
    console.log(dateTime);
    this.orders = new Order(orderId, this.orderedItems, totalPrice,
      this.tendered, this.change, orderStatus, dateTime);
    this._ourOfferService.addToOrderedList(this.orders);
    this._dataStorageService.storeOrders()
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
    this.router.navigate(['receipt']);
  }

}
