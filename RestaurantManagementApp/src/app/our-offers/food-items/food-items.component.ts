import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {OurOffers} from '../our-offers.model';
import {Order} from '../../shared/order.model';
import {OurOffersService} from '../our-offers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Popup} from 'ng2-opd-popup';
import {OrderedItems} from '../../shared/ordered-items.model';
import { Uuid } from 'ng2-uuid';

@Component({
  selector: 'app-food-items',
  templateUrl: './food-items.component.html',
  styleUrls: ['./food-items.component.scss']
})
export class FoodItemsComponent implements OnInit {
  @Input() menu: OurOffers;
  @Input() index: number;

  order: Order[];
  condition = false;
  @ViewChild('amountInput') amountInputRef: ElementRef;

  uuidCodeOne = '';
  uuidCodeTwo = '';
  uuidCodeThree = '';
  quantity = 0;
  constructor(private _ourOfferService: OurOffersService,
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
  }


  UpdateCart(id: number, price: number, name: string, isAdd: boolean) {
    let orderItemId = this.uuidCodeOne;
    let orderId = this._ourOfferService.uuidCodeOne;
    this.quantity = this.amountInputRef.nativeElement.value;
    let foodItemId = id;
    let foodItemName = name;
    let Price = price;
    if ( isAdd === true ) {
      this.AddToCart( orderItemId, orderId, this.quantity, foodItemId,
        foodItemName, Price );
    } else {
      this.RemoveFromCart(orderItemId, orderId, this.quantity,
        foodItemId, foodItemName, Price );
    }

  }

  AddToCart(orderItemId: string, orderId: string, quantity: number,
            foodItemId: number, foodItemName: string, price: number   )
  {

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
    this._ourOfferService.totalQuantity = Number.parseInt(this._ourOfferService.totalQuantity.toString())
      + Number.parseInt(this.amountInputRef.nativeElement.value.toString());

  }

  RemoveFromCart(orderItemId: string, orderId: string, quantity: number,
                 foodItemId: number, foodItemName: string, price: number ) {

    let subTotal = this._ourOfferService.FoodItemSubTotalPrice(price, quantity);

    this.quantity= this._ourOfferService.removeFromFoodItemCart(foodItemId, quantity, subTotal);
    this._ourOfferService.totalQuantity =
      Number.parseInt(this._ourOfferService.totalQuantity.toString()) -
      Number.parseInt(this.amountInputRef.nativeElement.value.toString());
  }
}
