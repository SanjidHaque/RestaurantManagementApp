import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import {UserAccountDataStorageService} from '../services/data-storage/user-account-data-storage.service';

@Injectable()
export class UserAccountResolverService implements Resolve<any> {

  constructor(private userAccountDataStorageService: UserAccountDataStorageService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.userAccountDataStorageService.getUserAccount(route.paramMap.get('user-account-id'));
  }

}
