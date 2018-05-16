import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Http} from '@angular/http';
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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _http: Http,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
  ) {this.route.params
    .subscribe(
      (params: Params) => {
        this.foodItemId = params['id'];
      }
    );
  }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: FoodItems[]) => {
        this._ourOfferService.FoodItem = data['foodItems'];
      }
    );
    this.foodItems = this._ourOfferService.FoodItem;
    for (let i = 0; i < this.foodItems.length; i++) {
      if (this.foodItems[i].Id === this.foodItemId) {
        this.imageUrl = this.foodItems[i].FoodItemImage;
      }
    }
    if (this.imageUrl === null || this.imageUrl === '' ) {
      this.imageUrl = '/assets/noImage.png';
    }
  }
  saveFoodItemImage(Image) {
    this._dataStorageService.saveFoodItemImage(this.foodItemId, this.fileToUpload).subscribe(
      data => {
        console.log('done');
        Image.value = null;
        this.imageUrl = '/assets/noImage.png';
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
