import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Component, ViewChild} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrManager} from 'ng6-toastr-notifications';

import {UserAccountDataStorageService} from '../../services/data-storage/user-account-data-storage.service';
import {PointOfSaleService} from '../../services/shared/point-of-sale.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isDisabled = false;

  constructor(private userAccountDataStorageService: UserAccountDataStorageService,
              private pointOfSaleService: PointOfSaleService,
              private toastr: ToastrManager,
              private router : Router) { }

  login(form: NgForm) {
    const userName  = form.value.userName;
    const password  = form.value.password;

    this.isDisabled = true;
    this.userAccountDataStorageService.login(userName, password)
       .subscribe(
         (data : any) => {
         localStorage.setItem('userToken', data.access_token);
         localStorage.setItem('userRoles', data.role);
         localStorage.setItem('userNameForLogin', data.userName);
         this.pointOfSaleService.userName = data.userName;
         this.router.navigate(['/pos']);
       },
       (error : HttpErrorResponse) => {
        this.isDisabled = false;
       });
  }
}
