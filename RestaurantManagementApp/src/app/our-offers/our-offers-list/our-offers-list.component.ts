import {Component, Input, OnInit} from '@angular/core';
import {SetMenu} from '../our-offers.model';
import {ActivatedRoute, Router} from '@angular/router';
import {OurOffersService} from '../our-offers.service';

@Component({
  selector: 'app-our-offers-list',
  templateUrl: './our-offers-list.component.html',
  styleUrls: ['./our-offers-list.component.scss']
})
export class OurOffersListComponent implements OnInit {
  @Input() setMenu: SetMenu;
  @Input() index: number;

  constructor(private _ourOfferService: OurOffersService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
  }
  OnAddToPurchasedFood() {
    this.router.navigate(['purchased-food'], { relativeTo: this.route});

  }
}
