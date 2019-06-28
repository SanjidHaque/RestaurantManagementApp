import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';

import {UserAccount} from '../models/user-account.model';
import {UserAccountDataStorageService} from '../services/data-storage/user-account-data-storage.service';

@Injectable()
export class UserAccountsResolverService implements Resolve<UserAccount[]> {

  constructor(private userAccountDataStorageService: UserAccountDataStorageService) { }

  resolve(): Observable<UserAccount[]> | Promise<UserAccount[]> | UserAccount[] {
    return this.userAccountDataStorageService.getAllUserAccount();
  }

}
