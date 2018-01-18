import {Component, ElementRef, ViewChild, Input, OnInit} from '@angular/core';
import {OurOffers} from '../our-offers.model';
import {ActivatedRoute, Router} from '@angular/router';
import {OurOffersService} from '../our-offers.service';
import { Uuid } from 'ng2-uuid';
import {Order} from '../../shared/order.model';
import {OrderedItems} from '../../shared/ordered-items.model';
import {Options} from 'selenium-webdriver/chrome';
import {Popup} from 'ng2-opd-popup';


@Component({
  selector: 'app-our-offers-list',
  templateUrl: './our-offers-list.component.html',
  styleUrls: ['./our-offers-list.component.scss']
})
export class OurOffersListComponent implements OnInit {
  @Input() menu: OurOffers;
  @Input() index: number;

  public totalQuantity: number = 0;
  order: Order[];
  condition = false;
  quantity = 0;
  @ViewChild('amountInput') amountInputRef: ElementRef;

  uuidCodeOne = '';
  uuidCodeTwo = '';
  uuidCodeThree = '';
  constructor(private _ourOfferService: OurOffersService,
              private router: Router,
              private route: ActivatedRoute,
              private uuid: Uuid,
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
    let setMenuId = id;
    let setMenuName = name;
    let Price = price;
    if ( isAdd === true ) {
      this.AddToCart( orderItemId, orderId, this.quantity, setMenuId,
        setMenuName, Price );
    } else {
      this.RemoveFromCart(orderItemId, orderId, this.quantity,
        setMenuId, setMenuName, Price );
    }

  }

   AddToCart(orderItemId: string, orderId: string, quantity: number,
                    setMenuId: number, setMenuName: string, price: number   )
  {

    let subTotal = this._ourOfferService.SetMenuSubTotaLPrice(price, quantity);
    this._ourOfferService.grandTotalPrice(subTotal);
    this.condition = this._ourOfferService.checkExistingSetMenu(setMenuId);

    if ( this.condition  ) {
      this._ourOfferService.increaseOnExistingSetMenu(setMenuId, quantity, subTotal );
    } else {
      const purchasedFood = new OrderedItems(orderItemId, orderId,  null, quantity, null , setMenuId, setMenuName, null, price, subTotal, null);
      this._ourOfferService.addToOrderedItemsList(purchasedFood);
    }
    this._ourOfferService.totalQuantity = Number.parseInt(this._ourOfferService.totalQuantity.toString()) + Number.parseInt(this.amountInputRef.nativeElement.value.toString());

  }

   RemoveFromCart(orderItemId: string, orderId: string, quantity: number,
                         setMenuId: number, setMenuName: string, price: number ) {

    let subTotal = this._ourOfferService.SetMenuSubTotaLPrice(price, quantity);

    this.quantity= this._ourOfferService.removeFromSetMenuCart(setMenuId, quantity, subTotal);
    this._ourOfferService.totalQuantity =
      Number.parseInt(this._ourOfferService.totalQuantity.toString()) -
      Number.parseInt(this.amountInputRef.nativeElement.value.toString());
  }

}

/*
let subTotal = this._ourOfferService.SetMenuSubTotaLPrice(Price, quantity);
this._ourOfferService.grandTotalPrice(subTotal);
this.condition = this._ourOfferService.checkExistingSetMenu(setMenuId);

if ( this.condition  ) {
  this._ourOfferService.increaseOnExistingSetMenu(setMenuId, quantity, subTotal );
} else {
  const purchasedFood = new OrderedItems(orderItemId, orderId,  null, quantity, null , setMenuId, name, null, price, subTotal, null);
  this._ourOfferService.addToOrderedItemsList(purchasedFood);
}
this._ourOfferService.totalQuantity = Number.parseInt(this._ourOfferService.totalQuantity.toString())
  + Number.parseInt(this.amountInputRef.nativeElement.value.toString());*/
