import {Component, Input, OnInit} from '@angular/core';
import {OurOffers} from '../our-offers.model';

@Component({
  selector: 'app-food-items',
  templateUrl: './food-items.component.html',
  styleUrls: ['./food-items.component.scss']
})
export class FoodItemsComponent implements OnInit {
  @Input() menu: OurOffers;
  @Input() index: number;
  constructor() { }

  ngOnInit() {
  }

}
