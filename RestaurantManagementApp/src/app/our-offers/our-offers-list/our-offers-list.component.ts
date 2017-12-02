import {Component, Input, OnInit} from '@angular/core';
import {OurOffers} from '../our-offers.model';
import {ActivatedRoute, Router} from '@angular/router';
import {OurOffersService} from '../our-offers.service';
import { Uuid } from 'ng2-uuid';
import {Order} from '../../shared/order.model';
import {OrderedItems} from '../../shared/ordered-items.model';


@Component({
  selector: 'app-our-offers-list',
  templateUrl: './our-offers-list.component.html',
  styleUrls: ['./our-offers-list.component.scss']
})
export class OurOffersListComponent implements OnInit {
  @Input() menu: OurOffers;
  @Input() index: number;
  order: Order[];
  uuidCodeOne: string = '';
  uuidCodeTwo: string = '';
  constructor(private _ourOfferService: OurOffersService,
              private router: Router,
              private route: ActivatedRoute,
              private uuid: Uuid) {
    this.uuidCodeOne = this.uuid.v1();
    this.uuidCodeTwo = this.uuid.v1();
  }

  ngOnInit() {
  }

  OnAddToPurchasedFood(id: number) {
    let purchasedFoodId = this.uuidCodeOne;
    let orderId = this.uuidCodeTwo;
    let quantity = 1;
    let setMenuId = id;
    const purchaesdFood = new OrderedItems(purchasedFoodId,orderId,null,quantity,setMenuId);
    this._ourOfferService.addToOrderedItemsList(purchaesdFood);
    this.router.navigate(['purchased-food'], { relativeTo: this.route});
  }
}
