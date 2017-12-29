import {Component, Input, OnInit} from '@angular/core';
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
  order: Order[];
  /*totalPrice = 0;*/

  uuidCodeOne = '';
  uuidCodeTwo = '';
  uuidCodeThree = '';
  constructor(private _ourOfferService: OurOffersService,
              private router: Router,
              private route: ActivatedRoute,
              private uuid: Uuid,
              private popUp: Popup) {
    this.uuidCodeOne = this.uuid.v1();
    this.uuidCodeTwo = this.uuid.v1();
    this.uuidCodeThree = this.uuid.v1();
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
    this.router.navigate(['purchased-food'], { relativeTo: this.route});
  }

  AddToCart(id: number, price: number, name: string) {
    /*this.popUp.options={
      color: 'black',
      showButtons: true,
      cancleBtnContent: 'Cancel'
    }
    this.popUp.show();*/
    let purchasedFoodId = this.uuidCodeOne;
    let orderId = this.uuidCodeTwo;
    let quantity = 1;
    let setMenuId = id;
    let setMenuName = name;
    let Price = price;
    this._ourOfferService.totalPrice(price);
    const purchasedFood = new OrderedItems(purchasedFoodId, orderId,  null, quantity, setMenuId, name, price);
    this._ourOfferService.addToOrderedItemsList(purchasedFood);
  }

}

