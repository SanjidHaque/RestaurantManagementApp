import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FoodItem} from '../../../../models/food-item.model';
import {DataStorageService} from '../../../../services/data-storage.service';
import {PointOfSaleService} from '../../../../services/point-of-sale.service';


@Component({
  selector: 'app-edit-food-item-image',
  templateUrl: './edit-food-item-image.component.html',
  styleUrls: ['./edit-food-item-image.component.scss']
})
export class EditFoodItemImageComponent implements OnInit {
  foodItemId : string;
  fileToUpload: File = null;
  imageUrl = '';
  foodItems: FoodItem[] = [];
  rootUrl = '';
  isDisabled = false;
  @ViewChild('Image') Image: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private pointOfSaleService: PointOfSaleService,
              private dataStorageService: DataStorageService,
  ) {this.route.params
    .subscribe(
      (params: Params) => {
        this.foodItemId = params['id'];
      }
    );
  }

  ngOnInit() {
    // this.rootUrl = this.dataStorageService.rootUrl + '/Content/';
    // this.route.data.
    // subscribe(
    //   ( data: foodItem[]) => {
    //     this.ourOffersService.foodItems = data['foodItems'];
    //   }
    // );
    // this.foodItems = this.ourOffersService.foodItems;
    // for (let i = 0; i < this.foodItems.length; i++) {
    //   if (this.foodItems[i].Id === this.foodItemId) {
    //     if ( this.foodItems[i].FoodItemImageName === null || this.foodItems[i].FoodItemImageName === '' ) {
    //       this.imageUrl = '/assets/noImage.png';
    //     } else {
    //       this.imageUrl = this.rootUrl + this.foodItems[i].FoodItemImageName;
    //     }
    //   }
    // }
  }
  saveFoodItemImage(Image) {
    this.isDisabled = true;
    this.dataStorageService.uploadFoodItemImage(this.foodItemId, this.fileToUpload).subscribe(
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
    const fileExtension = file.item(0).name.split('.').pop();

    if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
      this.isDisabled = false;
      this.fileToUpload = file.item(0);
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      };
      reader.readAsDataURL(this.fileToUpload);
    } else {
      this.Image.value = '';
      this.isDisabled = true;
      alert('Unsupported image format');
    }

  }
}
