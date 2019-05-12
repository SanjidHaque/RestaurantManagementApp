import {Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {Setting} from '../models/setting.model';
import {SettingDataStorageService} from '../services/data-storage/setting-data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SettingResolverService implements Resolve<Setting> {

  constructor(private settingDataStorageService: SettingDataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Setting> |
    Promise<Setting> | Setting {
    return this.settingDataStorageService.getAllSetting();
  }
}
