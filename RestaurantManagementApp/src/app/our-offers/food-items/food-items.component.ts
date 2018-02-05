import {Component, DoCheck, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {OurOffers} from '../our-offers.model';
import {Order} from '../../shared/order.model';
import {OurOffersService} from '../our-offers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Popup} from 'ng2-opd-popup';
import {OrderedItems} from '../../shared/ordered-items.model';
import { Uuid } from 'ng2-uuid';
import {Subscription} from 'rxjs/Subscription';
import {DataStorageService} from '../../shared/data-storage.service';
import {FoodItems} from '../../shared/food-item.model';

@Component({
  selector: 'app-food-items',
  templateUrl: './food-items.component.html',
  styleUrls: ['./food-items.component.scss']
})
export class FoodItemsComponent implements OnInit {
  Menu: OurOffers;
  index: number;
  FoodItem: FoodItems[] = [];
  public orderedItems: OrderedItems[] = [];
  selectedQuantity = [];

  order: Order[];
  condition = false;
  @ViewChild('amountInput') amountInputRef: ElementRef;
  uuidCodeOne = '';
  uuidCodeTwo = '';
  uuidCodeThree = '';
  quantity : number;
  subscription: Subscription;
  constructor(private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private router: Router,
              private route: ActivatedRoute,
              private uuid: Uuid,
              private popUp: Popup
  ) {
    this.uuidCodeOne = this.uuid.v1();
    this.uuidCodeTwo = this.uuid.v1();
    this.uuidCodeThree = this.uuid.v1();
  }

  ngOnInit() {

    this._dataStorageService.getMenu()
      .subscribe(
        (Menu: OurOffers ) => {
          this._ourOfferService.FoodItem = Menu.FoodItems;
        });
    this.FoodItem = this._ourOfferService.FoodItem;

    this._ourOfferService.foodItemChanged
      .subscribe(
        (FoodItem: FoodItems[]) => {
          this.FoodItem = FoodItem;
        }
      );
    // this.orderedItems = this._ourOfferService.orderedItems;
  }

 /* ngDoCheck() {
    // this.orderedItems = this._ourOfferService.orderedItems;
  }*/

  UpdateCart(id: number, price: number, name: string, isAdd: boolean, index: any) {
    let orderItemId = this.uuid.v1();
    let orderId = this._ourOfferService.uuidCodeOne;
    this.quantity = this.selectedQuantity[index];
    let foodItemId = id;
    let foodItemName = name;
    let Price = price;
    if ( isAdd === true ) {
      this.AddToCart( orderItemId, orderId,  this.quantity, foodItemId,
        foodItemName, Price );
    } else {
      this.RemoveFromCart(orderItemId, orderId,  this.quantity,
        foodItemId, foodItemName, Price );
    }

  }

  AddToCart(orderItemId: string, orderId: string, quantity: number,
            foodItemId: number, foodItemName: string, price: number ) {

    let subTotal = this._ourOfferService.FoodItemSubTotalPrice(price, quantity);
    this._ourOfferService.grandTotalPrice(subTotal);
    this.condition = this._ourOfferService.checkExistingFoodItem(foodItemId);

    if ( this.condition  ) {
      this._ourOfferService.increaseOnExistingFoodItem(foodItemId, quantity, subTotal );
    } else {

      const purchasedFood = new OrderedItems(orderItemId, orderId,  foodItemId, null,
        quantity , null , null, foodItemName, price, null , subTotal);

      this._ourOfferService.addToOrderedItemsList(purchasedFood);
    }
    this._ourOfferService.totalQuantity
      = Number.parseInt(this._ourOfferService.totalQuantity.toString())
      + Number.parseInt(quantity.toString());
    /*debugger*/

  }

  RemoveFromCart(orderItemId: string, orderId: string, quantity: number,
                 foodItemId: number, foodItemName: string, price: number ) {

    let subTotal = this._ourOfferService.FoodItemSubTotalPrice(price, quantity);

    this.quantity= this._ourOfferService.removeFromFoodItemCart(foodItemId, quantity, subTotal);
    this._ourOfferService.totalQuantity =
      Number.parseInt(this._ourOfferService.totalQuantity.toString()) -
      Number.parseInt(quantity.toString());
    /*debugger*/
  }
}
