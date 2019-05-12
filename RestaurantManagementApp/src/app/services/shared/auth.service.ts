import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {ModifiedUserModel} from '../../models/modified-user.model';
import {Role} from '../../models/role.model';
import {TableDataStorageService} from '../data-storage/table-data-storage.service';
import {ChangePassword} from '../../models/change-password.model';

@Injectable()
export class AuthService {
  rootUrl = '';

  constructor(private http: HttpClient,
              private dataStorageService: TableDataStorageService) {
     this.rootUrl = this.dataStorageService.rootUrl;
  }








}
