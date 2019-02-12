
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';


import {ModifiedUserModel} from './shared/modified-user.model';
import {Subject} from 'rxjs';

@Injectable()
export class UserService {

  private backEndPort = '1548';

  readonly rootUrl = 'http://localhost:' + this.backEndPort;
  private _modifiedUserJson = 'assets/modified-user.json';
  private _modifiedUserApi =  this.rootUrl + '/api/GetUsersList';

  public modifiedUser: ModifiedUserModel[] = [];
  public modifiedUserChanged =  new Subject<ModifiedUserModel[]>();

  constructor(private _http: HttpClient) { }

  registerUser(name: string, password: string, email: string, role: string, dateTime: string) {
    const body = {
      UserName: name,
      Password: password,
      Email: email,
      Role : role,
      DateTime : dateTime
    };
    const reqHeader = new HttpHeaders({'No-Auth': 'True'});
    return this._http.post(this.rootUrl + '/api/User/Register', body
      );
  }

  userAuthentication(userName, password) {
    const data =
      'username=' + userName + '&password='  + password + '&grant_type=password';
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    return this._http.post(this.rootUrl + '/token', data);
  }


  getAllRoles() {
    return this._http.get('/assets/role.json');
  }

  resetPassword(userName: string) {
    const body = {
      UserName: userName,
      Id: '',
      NewPassword: ''
    };
    return this._http.post(this.rootUrl + '/api/ResetPassword', body);
  }

  newPassword(password: string, code: string) {
    const body = {
      UserName: '',
      Id: code,
      NewPassword: password
    };
    return this._http.post(this.rootUrl + '/api/NewPassword', body);
  }

  roleMatch(allowedRoles) {
    let isMatch = false;
    const userRoles: string
      = JSON.parse(JSON.stringify(localStorage.getItem('userRoles')));
    allowedRoles.forEach(element => {
      if (userRoles.indexOf(element) > -1) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }

  deleteUser(user: ModifiedUserModel, index: number) {
    this.modifiedUser.splice(index, 1);
    this.modifiedUserChanged.next(this.modifiedUser.slice());
    return this._http.post(this.rootUrl + '/api/DeleteUser', user).subscribe();
  }

  getUsers() {
    return this._http.get(this._modifiedUserApi);
  }

  addToUserList(user: ModifiedUserModel) {
    this.modifiedUser.push(user);
    this.modifiedUserChanged.next(this.modifiedUser.slice());
  }

}
