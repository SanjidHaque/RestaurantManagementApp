import { Component, OnInit } from '@angular/core';
import {OurOffersService} from '../../our-offers/our-offers.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.scss']
})
export class FoodItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
