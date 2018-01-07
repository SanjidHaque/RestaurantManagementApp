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
 /* public setMenuImage: string[] = [
    'assets/ImageOne.jpg',
    'assets/ImageTwo.jpg'
  ];*/

  public totalQuantity: number = 0;
  order: Order[];
  condition = false;
  /*GrandTotalPrice = 0;*/
  @ViewChild('amountInput') amountInputRef: ElementRef;

  uuidCodeOne = '';
  uuidCodeTwo = '';
  uuidCodeThree = '';
  constructor(private _ourOfferService: OurOffersService,
              private router: Router,
              private route: ActivatedRoute,
              private uuid: Uuid,
              private popUp: Popup
              ) {
    this.uuidCodeOne = this.uuid.v1();
    this.uuidCodeTwo = this.uuid.v1();
    this.uuidCodeThree = this.uuid.v1();
    /*this.condition = false;*/
  }

  ngOnInit() {
  }

  OnAddToPurchasedFood(id: number) {
    /*let purchasedFoodId = this.uuidCodeOne;
    let orderId = this.uuidCodeTwo;
    let quantity = 1;
    let setMenuId = id;
    const purchaesdFood = new OrderedItems(purchasedFoodId,orderId,null,quantity,setMenuId);
    this._ourOfferService.addToOrderedItemsList(purchaesdFood);*/
    this.router.navigate(['cheff'], { relativeTo: this.route});
  }

  AddToCart(id: number, price: number, name: string) {
    /*this.popUp.options={
      color: 'black',
      showButtons: true,
      cancleBtnContent: 'Cancel'
    }
    this.popUp.show();*/
    let orderItemId = this.uuidCodeOne;
    /*let orderId = this.uuidCodeTwo;*/
    let quantity = this.amountInputRef.nativeElement.value;
    let setMenuId = id;
    let setMenuName = name;
    let Price = price;
    let subTotal = this._ourOfferService.subTotaLPrice(Price, quantity);
     this._ourOfferService.grandTotalPrice(subTotal);
    this.condition = this._ourOfferService.checkExistingSetMenu(setMenuId);

     if ( this.condition /*this._ourOfferService.checkExistingSetMenu(setMenuId) */ ) {
       this._ourOfferService.increaseOnExisting(setMenuId, quantity);
      } else {
       const purchasedFood = new OrderedItems(orderItemId,  null, quantity, setMenuId, name, price, subTotal);
       this._ourOfferService.addToOrderedItemsList(purchasedFood);
     }
    this._ourOfferService.totalQuantity += this.amountInputRef.nativeElement.value;
    /*  this.totalQuantity =
      Number.parseInt(this.totalQuantity.toString())
        + Number.parseInt(quantity.toString());*/
  }
}

