import { Injectable } from '@angular/core';
import {Table} from '../../shared/table.model';
import {Observable} from 'rxjs/Observable';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DataStorageService} from '../../shared/data-storage.service';

@Injectable()
export class TableResolverService implements Resolve<Table> {

  constructor(private _dataStorageService: DataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> |
      Promise<any> | any {
    return this._dataStorageService.getTables();
  }

}


