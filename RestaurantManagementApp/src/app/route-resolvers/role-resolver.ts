import {UserService} from '../services/user.service';
import {Role} from '../models/role.model';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class RoleResolverService implements Resolve<Role[]> {

  constructor(private userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Role[]> |
    Promise<Role[]> | Role[] {
    return this.userService.getAllRoles();
  }

}
