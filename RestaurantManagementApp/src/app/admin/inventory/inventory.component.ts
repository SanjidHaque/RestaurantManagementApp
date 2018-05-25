import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Inventory} from '../../shared/inventory.model';
import {Http} from '@angular/http';
import {DataStorageService} from '../../shared/data-storage.service';
import {Subscription} from 'rxjs/Subscription';
import {OurOffersService} from '../../our-offers/our-offers.service';
import { LocationStrategy } from '@angular/common';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  public inventories: Inventory[] ;
  subscription: Subscription;


  constructor(private _route: ActivatedRoute,
              private _ourOfferService: OurOffersService,
             ) {

  }

  ngOnInit() {


  }
}
