import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {FoodItem} from '../../models/food-item.model';
import {TableDataStorageService} from './table-data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FoodItemDataStorageService {
  private rootUrl = '';

  constructor(private http: HttpClient,
              private tableDataStorageService: TableDataStorageService) {
    this.rootUrl = tableDataStorageService.rootUrl;
  }

  getFoodItem(foodItemId: number) {
    return this.http.get(`${this.rootUrl + '/api/GetFoodItem'}/${foodItemId}` );
  }

  getAllFoodItem() {
    return this.http.get<FoodItem[]>(this.rootUrl + '/api/GetAllFoodItem');
  }

  addNewFoodItem(foodItem: FoodItem) {
    return this.http.post<FoodItem>(this.rootUrl + '/api/AddNewFoodItem', foodItem);
  }

  editFoodItem(foodItem: FoodItem) {
    return this.http.put<FoodItem>(this.rootUrl + '/api/EditFoodItem', foodItem);
  }

  deleteFoodItem(foodItemId: number) {
    return this.http.delete(`${this.rootUrl + '/api/DeleteFoodItem'}/${foodItemId}` );
  }

  uploadFoodItemImage(foodItemId: string, fileToUpload: File) {
    if (fileToUpload.name !==  null || fileToUpload.name !== '') {
      const formData = new FormData();
      formData.append('FoodItemImage', fileToUpload);
      formData.append('FoodItemId', foodItemId);
      return this.http.post(this.rootUrl + '/api/UploadFoodItemImage', formData);
    }
  }

}
