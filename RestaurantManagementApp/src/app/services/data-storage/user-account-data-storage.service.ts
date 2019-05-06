import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TableDataStorageService} from './table-data-storage.service';
import {Table} from '../../models/table.model';
import {Role} from '../../models/role.model';
import {UserAccount} from '../../models/user-account.model';

@Injectable({
  providedIn: 'root'
})
export class UserAccountDataStorageService {

  private rootUrl = '';

  constructor(private http: HttpClient,
              private tableDataStorageService: TableDataStorageService) {
    this.rootUrl = tableDataStorageService.rootUrl;
  }

  getAllRole() {
    return this.http.get<Role[]>(this.rootUrl + '/api/GetAllRole');
  }

  register(userAccount: UserAccount) {
    const reqHeader = new HttpHeaders({'No-Auth': 'True'});
    return this.http.post(this.rootUrl + '/api/Register', userAccount);
  }

  getAllUser() {

  }

}
