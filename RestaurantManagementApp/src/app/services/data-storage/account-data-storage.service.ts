import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TableDataStorageService} from './table-data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountDataStorageService {

  private rootUrl = '';

  constructor(private http: HttpClient,
              private tableDataStorageService: TableDataStorageService) {
    this.rootUrl = tableDataStorageService.rootUrl;
  }
}
