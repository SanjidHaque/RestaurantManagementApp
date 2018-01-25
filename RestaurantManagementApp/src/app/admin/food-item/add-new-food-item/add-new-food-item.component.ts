import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Uuid } from 'ng2-uuid';
import {FoodItems} from '../../../shared/food-item.model';

@Component({
  selector: 'app-add-new-food-item',
  templateUrl: './add-new-food-item.component.html',
  styleUrls: ['./add-new-food-item.component.scss']
})

export class AddNewFoodItemComponent implements OnInit {
  uuidCodeOne = '';
  name: string;
  price: number;



  constructor(private route: ActivatedRoute,
              private router: Router,
              private uuid: Uuid,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService) {
    this.uuidCodeOne = this.uuid.v1();
  }

  ngOnInit() {
  }

  onAddNewFoodItem(form: NgForm) {
    this.name  = form.value.name;
    this.price = form.value.price;
    this.router.navigate(['admin/food-item/add-new-food-item/add-ingredients', this.uuidCodeOne]);
  }

  onSaveFoodItem() {
    const newFoodItem =
      new FoodItems(this.uuidCodeOne, this.name, this.price,
      null, this._ourOfferService.getIngredients() );
    this._ourOfferService.addToFoodItemList(newFoodItem);
  }


  onCancel() {
    this.router.navigate(['admin/food-item']);
  }
}
