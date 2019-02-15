import {UserService} from '../services/user.service';
import {ModifiedUserModel} from '../models/modified-user.model';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class ModifiedUserResolverService  implements Resolve<ModifiedUserModel[]> {

  constructor(private userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ModifiedUserModel[]> |
    Promise<ModifiedUserModel[]> | ModifiedUserModel[] {
    return this.userService.getUsers();
  }

}