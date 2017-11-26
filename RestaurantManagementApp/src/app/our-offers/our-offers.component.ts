import {Component, Input, OnInit, Output} from '@angular/core';
import {OurOffersService} from './our-offers.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-our-offers',
  templateUrl: './our-offers.component.html',
  styleUrls: ['./our-offers.component.scss']
})
export class OurOffersComponent implements OnInit {
   public setMenus = [];
   public foodCart = [];

  constructor(private _ourOfferService: OurOffersService,
              private router: Router,
              private route: ActivatedRoute) { }
  ngOnInit() {
      this._ourOfferService.getSetMenu()
        .subscribe(
          responseToSetMenu => this.setMenus = responseToSetMenu
        );
    }
  purchasedFood(index: number) {
    this.router.navigate(['purchased-food'], { relativeTo: this.route});
    this.foodCart = this.setMenus[index];
  }
}
