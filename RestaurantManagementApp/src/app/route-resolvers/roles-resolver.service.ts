import {Observable} from 'rxjs';
import {Resolve} from '@angular/router';
import {Injectable} from '@angular/core';

import {Role} from '../models/role.model';
import {UserAccountDataStorageService} from '../services/data-storage/user-account-data-storage.service';

@Injectable()
export class RolesResolverService implements Resolve<Role[]> {

  constructor(private accountDataStorageService: UserAccountDataStorageService) { }

  resolve(): Observable<Role[]> | Promise<Role[]> | Role[] {
    return this.accountDataStorageService.getAllRole();
  }
}
