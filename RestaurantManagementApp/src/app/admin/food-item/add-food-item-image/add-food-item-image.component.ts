import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {DataStorageService} from '../../../shared/data-storage.service';

@Component({
  selector: 'app-add-food-item-image',
  templateUrl: './add-food-item-image.component.html',
  styleUrls: ['./add-food-item-image.component.scss']
})

export class AddFoodItemImageComponent implements OnInit {
  foodItemId : string;
  fileToUpload: File = null;
  isDisabled = false;
  imageUrl = '/assets/noImage.png';
  constructor(private route: ActivatedRoute,
              private router: Router,
              private _dataStorageService: DataStorageService
  ) {this.route.params
    .subscribe(
      (params: Params) => {
        this.foodItemId = params['id'];
      }
    );
  }

  ngOnInit() {
  }

  saveFoodItemImage(Image) {
    this._dataStorageService.saveFoodItemImage(this.foodItemId, this.fileToUpload).subscribe(
      data => {
        this.isDisabled = true;
        Image.value = null;
        this.imageUrl = '/assets/noImage.png';
        this.router.navigate(['admin/food-item/grid-view']);
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
