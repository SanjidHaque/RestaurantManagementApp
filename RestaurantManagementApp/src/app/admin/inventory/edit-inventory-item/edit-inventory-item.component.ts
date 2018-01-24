import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {Inventory} from '../../../shared/inventory.model';

@Component({
  selector: 'app-edit-inventory-item',
  templateUrl: './edit-inventory-item.component.html',
  styleUrls: ['./edit-inventory-item.component.scss']
})
export class EditInventoryItemComponent implements OnInit {
   id: string;
   name = '';
   price: number
   quantity: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _ourOfferService: OurOffersService ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          for (let i = 0; i< this._ourOfferService.inventory.length; i++) {
            if ( this._ourOfferService.inventory[i].Id === this.id ) {

               this.name = this._ourOfferService.inventory[i].Name;
               this.price = this._ourOfferService.inventory[i].Price;
               this.quantity = this._ourOfferService.inventory[i].Quantity;
            }
          }

        }
      );

  }

}
