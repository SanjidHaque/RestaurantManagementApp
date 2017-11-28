import {Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {OurOffersService} from './our-offers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {SetMenu} from './our-offers.model';
import {DataStorageService} from '../shared/data-storage.service';

@Component({
  selector: 'app-our-offers',
  templateUrl: './our-offers.component.html',
  styleUrls: ['./our-offers.component.scss']
})
export class OurOffersComponent implements OnInit, OnDestroy {
    setMenus: SetMenu[];
    subscription: Subscription;

  constructor(private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private router: Router,
              private route: ActivatedRoute) { }

      /*this._ourOfferService.getOurOffers()
        .subscribe(
          responseToSetMenu => this.setMenus = responseToSetMenu
        );*/
  ngOnInit() {
    this.subscription = this._ourOfferService.setMenuChanged
      .subscribe(
        (setMenu: SetMenu[]) => {
          this.setMenus = setMenu;
        }
      );
    this.setMenus = this._ourOfferService.getOurOffers();
    this._dataStorageService.getRecipes();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
