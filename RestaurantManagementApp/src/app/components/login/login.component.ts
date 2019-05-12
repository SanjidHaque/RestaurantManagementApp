import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Component, ViewChild} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

import {UserAccountDataStorageService} from '../../services/data-storage/user-account-data-storage.service';
import {ToastrManager} from 'ng6-toastr-notifications';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoginError = false;
  isDisabled = false;

  constructor(private userAccountDataStorageService: UserAccountDataStorageService,
              private toastr: ToastrManager,
              private router : Router) { }



  login(form: NgForm) {
    const userName  = form.value.userName;
    const password  = form.value.password;
    if (userName === '' || password === '') { return; }

    this.isDisabled = true;
    this.userAccountDataStorageService.login(userName, password)
       .subscribe(
         (data : any) => {
         localStorage.setItem('userToken', data.access_token);
         localStorage.setItem('userRoles', data.role);
         localStorage.setItem('userNameForLogin', data.userName);
         this.router.navigate(['/pos']);
       },
       (error : HttpErrorResponse) => {
        this.isDisabled = false;
       });
  }
}
