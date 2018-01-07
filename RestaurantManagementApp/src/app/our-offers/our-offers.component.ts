import {Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { Response } from '@angular/http';
import {OurOffersService} from './our-offers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {OurOffers} from './our-offers.model';
import {DataStorageService} from '../shared/data-storage.service';

@Component({
  selector: 'app-our-offers',
  templateUrl: './our-offers.component.html',
  styleUrls: ['./our-offers.component.scss']
})
export class OurOffersComponent implements OnInit, OnDestroy {
    Menu: OurOffers;
    subscription: Subscription;
    toCheckOut = false;
    quantity: number = 0;


  constructor(private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private router: Router,
              private route: ActivatedRoute) {
    this.Menu = new OurOffers();
  }

      /*this._ourOfferService.getOurOffers()
        .subscribe(
          responseToSetMenu => this.setMenus = responseToSetMenu
        );*/
  ngOnInit() {
    this.subscription = this._ourOfferService.menuChanged
      .subscribe(
        (Menu: OurOffers) => {
          this.Menu = Menu;
        }
      );
  /*  this.Menu = this._ourOfferService.getOurOffers();*/
    this._dataStorageService.getMenu()
      .subscribe((Menu: OurOffers ) => {
      this.Menu = Menu;
    });

  this.quantity += this._ourOfferService.totalQuantity;
  }

  saveOrders() {
    this._dataStorageService.storeOrders()
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  allowToCheckOut() {
    if (this._ourOfferService.TotalPrice > 0) {
      return this.toCheckOut = true;
    }  else { return this.toCheckOut = false; }
  }
}
