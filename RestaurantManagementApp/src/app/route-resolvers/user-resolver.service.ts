import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {UserAccount} from '../models/user-account.model';
import {UserAccountDataStorageService} from '../services/data-storage/user-account-data-storage.service';

@Injectable()
export class UserResolverService implements Resolve<UserAccount[]> {

  constructor(private userAccountDataStorageService: UserAccountDataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserAccount[]> |
    Promise<UserAccount[]> | UserAccount[] {
    return this.userAccountDataStorageService.getAllUserAccount();
  }

}
