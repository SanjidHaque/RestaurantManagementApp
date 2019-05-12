import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TableDataStorageService} from './table-data-storage.service';
import {Table} from '../../models/table.model';
import {Role} from '../../models/role.model';
import {UserAccount} from '../../models/user-account.model';
import {FoodItem} from '../../models/food-item.model';
import {ChangePassword} from '../../models/change-password.model';

@Injectable({
  providedIn: 'root'
})
export class UserAccountDataStorageService {

  private rootUrl = '';

  constructor(private http: HttpClient,
              private tableDataStorageService: TableDataStorageService) {
    this.rootUrl = tableDataStorageService.rootUrl;
  }

  login(userName, password) {
    const data = 'username=' + userName + '&password=' + password + '&grant_type=password';
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/x-www-urlencoded',
      'No-Auth': 'True'
    });
    return this.http.post(this.rootUrl + '/token', data, { headers: reqHeader });
  }

  roleMatch(allowedRoles) {
    let isMatch = false;
    const userRole = JSON.parse(JSON.stringify(localStorage.getItem('userRoles')));

    allowedRoles.forEach(element => {
      if (userRole.indexOf(element) > -1) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }


  resetPassword(changePassword: ChangePassword) {
    const reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
    return this.http.post(this.rootUrl + '/api/ResetPassword', changePassword, { headers: reqHeader });
  }

  newPassword(changePassword: ChangePassword) {
    const reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
    return this.http.post(this.rootUrl + '/api/NewPassword', changePassword, { headers: reqHeader});
  }


  getAllRole() {
    return this.http.get<Role[]>(this.rootUrl + '/api/GetAllRole');
  }

  addNewUserAccount(userAccount: UserAccount) {
    const reqHeader = new HttpHeaders({'No-Auth': 'True'});
    return this.http.post(this.rootUrl + '/api/AddNewUserAccount', userAccount);
  }

  getAllUserAccount() {
    return this.http.get<UserAccount[]>(this.rootUrl + '/api/GetAllUserAccount');
  }

  editUserAccount(userAccount: UserAccount) {
    return this.http.put<UserAccount>(this.rootUrl + '/api/EditUserAccount', userAccount);
  }

  deleteUserAccount(userAccountId: string) {
    return this.http.delete(`${this.rootUrl + '/api/DeleteUserAccount'}/${userAccountId}` );
  }

  changePasswordByAdmin(changePassword: ChangePassword) {
    return this.http.put<ChangePassword>(this.rootUrl + '/api/ChangePasswordByAdmin',
      changePassword);
  }

}
