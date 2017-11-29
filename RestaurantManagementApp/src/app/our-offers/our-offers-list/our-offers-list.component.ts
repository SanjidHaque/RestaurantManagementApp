import {Component, Input, OnInit} from '@angular/core';
import {OurOffers} from '../our-offers.model';
import {ActivatedRoute, Router} from '@angular/router';
import {OurOffersService} from '../our-offers.service';
import { Uuid } from 'ng2-uuid';


@Component({
  selector: 'app-our-offers-list',
  templateUrl: './our-offers-list.component.html',
  styleUrls: ['./our-offers-list.component.scss']
})
export class OurOffersListComponent implements OnInit {
  @Input() menu: OurOffers;
  @Input() index: number;
  uuidCode: string = '';
  constructor(private _ourOfferService: OurOffersService,
              private router: Router,
              private route: ActivatedRoute,
              private uuid: Uuid) {
    this.uuidCode = this.uuid.v1();
  }

  ngOnInit() {

  }
  OnAddToPurchasedFood() {
    this.router.navigate(['purchased-food', { getUuid: this.uuidCode}], { relativeTo: this.route});
  }
}
