import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {FoodItems} from '../../../shared/food-item.model';

@Component({
  selector: 'app-edit-food-item-image',
  templateUrl: './edit-food-item-image.component.html',
  styleUrls: ['./edit-food-item-image.component.scss']
})
export class EditFoodItemImageComponent implements OnInit {
  foodItemId : string;
  fileToUpload: File = null;
  imageUrl = '';
  foodItems: FoodItems[] = [];
  rootUrl = 'http://localhost:4202/Content/';

  constructor(private _route: ActivatedRoute,
              private router: Router,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
  ) {this._route.params
    .subscribe(
      (params: Params) => {
        this.foodItemId = params['id'];
      }
    );
  }

  ngOnInit() {
    this._route.data.
    subscribe(
      ( data: FoodItems[]) => {
        this._ourOfferService.FoodItem = data['foodItems'];
      }
    );
    this.foodItems = this._ourOfferService.FoodItem;
    for (let i = 0; i < this.foodItems.length; i++) {
      if (this.foodItems[i].Id === this.foodItemId) {
        if ( this.foodItems[i].FoodItemImage === null || this.foodItems[i].FoodItemImage === '' ) {
          this.imageUrl = '/assets/noImage.png';
        } else {
          this.imageUrl = this.rootUrl + this.foodItems[i].FoodItemImage;
        }
      }
    }
  }
  saveFoodItemImage(Image) {
    this._dataStorageService.saveFoodItemImage(this.foodItemId, this.fileToUpload).subscribe(
      data => {
        console.log('done');
        Image.value = null;
        this.imageUrl = '/assets/noImage.png';
        this.router.navigate(['admin/food-item/grid-view']);
      }
    );
  }

  skipFoodItemImage() {
    this.router.navigate(['admin/food-item/grid-details', this.foodItemId]);
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
  }
}
