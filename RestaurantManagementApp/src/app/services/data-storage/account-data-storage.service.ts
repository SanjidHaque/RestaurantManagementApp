import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TableDataStorageService} from './table-data-storage.service';
import {Table} from '../../models/table.model';
import {Role} from '../../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class AccountDataStorageService {

  private rootUrl = '';

  constructor(private http: HttpClient,
              private tableDataStorageService: TableDataStorageService) {
    this.rootUrl = tableDataStorageService.rootUrl;
  }

  getAllRole() {
    return this.http.get<Role[]>(this.rootUrl + '/api/GetAllRole');
  }

}
