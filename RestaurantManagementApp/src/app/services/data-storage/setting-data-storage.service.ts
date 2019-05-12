import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TableDataStorageService} from './table-data-storage.service';
import {FoodItem} from '../../models/food-item.model';
import {Setting} from '../../models/setting.model';

@Injectable({
  providedIn: 'root'
})
export class SettingDataStorageService {
  private rootUrl = '';

  constructor(private http: HttpClient,
              private tableDataStorageService: TableDataStorageService) {
    this.rootUrl = tableDataStorageService.rootUrl;
  }

  getAllSetting() {
    return this.http.get<Setting>(this.rootUrl + '/api/GetAllSetting');
  }

  editSetting(setting: Setting) {
    return this.http.put<Setting>(this.rootUrl + '/api/EditSetting', setting);
  }

}
