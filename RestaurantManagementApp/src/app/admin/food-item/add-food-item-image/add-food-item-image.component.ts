import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../../../shared/data-storage.service';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {Http} from '@angular/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FoodItems} from '../../../shared/food-item.model';

@Component({
  selector: 'app-add-food-item-image',
  templateUrl: './add-food-item-image.component.html',
  styleUrls: ['./add-food-item-image.component.scss']
})
export class AddFoodItemImageComponent implements OnInit {
  foodItemId : string;
  fileToUpload: File = null;
  imageUrl = '/assets/noImage.png';
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
    this.router.navigate(['admin/food-item/grid-view']);
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