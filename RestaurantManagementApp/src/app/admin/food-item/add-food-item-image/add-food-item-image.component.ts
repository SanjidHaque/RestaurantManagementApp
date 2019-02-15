import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {DataStorageService} from '../../../services/data-storage.service';

@Component({
  selector: 'app-add-food-item-image',
  templateUrl: './add-food-item-image.component.html',
  styleUrls: ['./add-food-item-image.component.scss']
})

export class AddFoodItemImageComponent implements OnInit {
  foodItemId : string;
  fileToUpload: File = null;
  isDisabled = false;
  imageUrl = 'assets/noImage.png';
  @ViewChild('Image') Image: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: DataStorageService
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
    this.isDisabled = true;
    this.dataStorageService.saveFoodItemImage(this.foodItemId, this.fileToUpload).subscribe(
      data => {
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
