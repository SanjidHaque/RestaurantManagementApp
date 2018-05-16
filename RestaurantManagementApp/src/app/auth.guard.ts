import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {UserService} from './user.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router : Router, private userService : UserService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {
    if (localStorage.getItem('userToken') != null)
    {
      const roles = next.data['roles'] as string;
      if (roles) {
        const match = this.userService.roleMatch(roles);
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
