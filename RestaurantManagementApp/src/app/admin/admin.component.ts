import {Component, Input, OnInit} from '@angular/core';
import {OurOffersService} from '../our-offers/our-offers.service';
import {Inventory} from '../shared/inventory.model';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
