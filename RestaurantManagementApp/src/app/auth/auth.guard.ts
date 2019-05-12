import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

import {UserAccountDataStorageService} from '../services/data-storage/user-account-data-storage.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router : Router,
              private userAccountDataStorageService : UserAccountDataStorageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {
    if (localStorage.getItem('userToken') != null) {
      const roles = next.data['roles'] as string;
      if (roles) {
        const match = this.userAccountDataStorageService.roleMatch(roles);
        if (match) {
          return true;
        } else {
          this.router.navigate(['/forbidden']);
          return false;
        }
      } else {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}
