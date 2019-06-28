import {Observable} from 'rxjs';
import {Resolve} from '@angular/router';
import { Injectable } from '@angular/core';

import {Setting} from '../models/setting.model';
import {SettingDataStorageService} from '../services/data-storage/setting-data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SettingResolverService implements Resolve<Setting> {

  constructor(private settingDataStorageService: SettingDataStorageService) { }

  resolve(): Observable<Setting> | Promise<Setting> | Setting {
    return this.settingDataStorageService.getAllSetting();
  }
}
