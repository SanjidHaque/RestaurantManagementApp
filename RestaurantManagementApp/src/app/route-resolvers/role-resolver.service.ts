import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {Role} from '../models/role.model';
import {AccountDataStorageService} from '../services/data-storage/account-data-storage.service';
import {Injectable} from '@angular/core';

@Injectable()
export class RoleResolverService implements Resolve<Role[]> {

  constructor(private accountDataStorageService: AccountDataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Role[]> |
    Promise<Role[]> | Role[] {
    return this.accountDataStorageService.getAllRole();
  }
}
