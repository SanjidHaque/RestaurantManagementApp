import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrManager} from 'ng6-toastr-notifications';
import {UserAccountDataStorageService} from '../../services/data-storage/user-account-data-storage.service';
import {ChangePassword} from '../../models/change-password.model';

import {ToastrManager} from 'ng6-toastr-notifications';
import {UserAccountDataStorageService} from '../../services/data-storage/user-account-data-storage.service';
import {ChangePassword} from '../../models/change-password.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  isDisabled = false;

  constructor(private userAccountDataStorageService: UserAccountDataStorageService,
              private toastr: ToastrManager,
              private router : Router) { }

  ngOnInit() {
  }

  getPasswordResetCode(form: NgForm) {
    this.isDisabled = true;
    this.userAccountDataStorageService.resetPassword(
      new ChangePassword(
        '',
        form.value.userName,
        '',
        '',
        ''
      )
    ).subscribe((data: any) => {
       if (data === 'User name found') {
         localStorage.setItem('userNameForResetPassword', form.value.userName);
         form.reset();
         this.toastr.successToastr(
           'A password reset code has sent to your email',
           'Success',
           {
           toastTimeout: 20000,
           newestOnTop: true,
           showCloseButton: true
         });
         this.router.navigate(['/new-password']);
      } else {
         this.isDisabled = false;
         this.toastr.successToastr(
           'Incorrect user name',
           'Error',
           {
             toastTimeout: 20000,
             newestOnTop: true,
             showCloseButton: true
           });
      }
    });

  }
}
