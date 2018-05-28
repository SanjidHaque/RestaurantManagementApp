import {Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStorageService} from '../../shared/data-storage.service';
import {OurOffersService} from '../our-offers.service';
import {Order} from '../../shared/order.model';
import {OrderedItems} from '../../shared/ordered-items.model';
import { Uuid } from 'ng2-uuid';
import {Table} from '../../shared/table.model';
import {Subscription} from 'rxjs/Subscription';
import {Popup} from 'ng2-opd-popup';
import {Inventory} from '../../shared/inventory.model';
import {FoodItems} from '../../shared/food-item.model';

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
  selectedTable = '';
  table: string;
  inventoryCost = 0;
  orderProfit = 0;
  public inventories: Inventory[] = [] ;
  public tables: Table[] = [];
  subscription: Subscription;
  FoodItemList: FoodItems[] = [];
  constructor(private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private router: Router,
              private _route: ActivatedRoute,
              private uuid: Uuid,
              private popup: Popup) {
    this.tendered = 0;
  }

  ngOnInit() {
    this.grandTotal = this._ourOfferService.TotalPrice;

    this._route.data.
    subscribe(
      ( data: Table[]) => {
        this._ourOfferService.table = data['tables'];
      }
    );
    this.tables = this._ourOfferService.table;
    this.subscription = this._ourOfferService.tableChanged
      .subscribe(
        (tables: Table[]) => {
          this.tables = tables;
        }
      );
  }

  ngDoCheck() {

  }
  discardOrder() {
    this.popup.options = {
      header: 'Destroy Current Order?',
      color: '#760000', // red, blue....
      widthProsentage: 40, // The with of the popou measured by browser width
      animationDuration: 1, // in seconds, 0 = no animation
      showButtons: true, // You can hide this in case you want to use custom buttons
      confirmBtnContent: 'Confirm', // The text on your confirm button
      cancleBtnContent: 'Cancel', // the text on your cancel button
      confirmBtnClass: 'btn btn-default', // your class for styling the confirm button
      cancleBtnClass: 'btn btn-default', // you class for styling the cancel button
      animation: 'bounceIn' // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown'
    };
    this.popup.show();
  }

  confirmEvent() {
    this._ourOfferService.clearOrders();
    this._ourOfferService.TotalPrice = 0;
    this._ourOfferService.totalQuantity = 0;
    this.router.navigate(['our-offers/regulars']);
    this.popup.hide();
  }

  cancelEvent() {
    this.popup.hide();
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
  selectChangeHandler (event: any) {
    this.selectedTable = event.target.value;
  }
  checkCertainChange() {
    if (this.tendered < this.grandTotal || this.tendered === 0 ) {
      return false;
    } else {
      return true;
    }
  }



  validate() {
    const orderId = this.uuid.v1();
    this.onCheck  = 1;

    this.orderedItems = this._ourOfferService.orderedItems;
    for ( let i = 0; i < this._ourOfferService.orderedItems.length; i++) {
      this._ourOfferService.orderedItems[i].OrderId = orderId;

    }

    const totalPrice = this._ourOfferService.TotalPrice;
    if ( this.selectedTable === '' || this.selectedTable === 'Select a Table' ) {
      this.table  =  'No Table';
    } else {
      this.table = this.selectedTable;
    }
    for (let i = 0; i < this.orderedItems.length; i++) {
        this.inventoryCost = Number.parseInt(this.inventoryCost.toString()) +
          (Number.parseInt(this.orderedItems[i].FoodItemQuantity.toString()) *
            Number.parseInt(this.orderedItems[i].FoodItemMakingCost.toString()));
    }

    this.orderProfit = totalPrice - this.inventoryCost;
    this.change = Number.parseInt(this.tendered.toString())
      - Number.parseInt(totalPrice.toString());
    const dateTime = new Date().toLocaleString();

    this.orders = new Order(orderId, this._ourOfferService.orderedItems, totalPrice,
      this.tendered, this.change, dateTime , this.table,
      this.inventoryCost, this.orderProfit );
    this._ourOfferService.addToOrderedList(this.orders);

    /*for (let i = 0; i < this.orders.OrderedItems.length; i++) {
     const foodItemId =  this.orders.OrderedItems[i].FoodItemId;
     for (let j = 0; j < this.FoodItemList.length; j++) {
       if (this.FoodItemList[j].Id === foodItemId) {
         for (let k = 0; k < this.FoodItemList[j].Ingredients.length; k++ ) {
           const quantity =  this.FoodItemList[j].Ingredients[k].Quantity;
           const totalQuantity = quantity * this.orders.OrderedItems[i].FoodItemQuantity;
           const inventoryId = this.FoodItemList[j].Ingredients[k].InventoryId;
           for (let l = 0; l < this.inventories.length; l++) {
             if (this.inventories[l].Id === inventoryId) {
               this.inventories[l].UsedQuantity =
                 Number.parseInt(this.inventories[l].UsedQuantity.toString())
               + Number.parseInt(totalQuantity.toString());

               this.inventories[l].RemainingQuantity =
                 Number.parseInt(this.inventories[l].RemainingQuantity.toString())
                 - Number.parseInt(totalQuantity.toString());
             }
           }
         }

       }
     }
    }*/
    this._dataStorageService.saveOrder(this.orders);
    this.router.navigate(['receipt']);
  }

}
