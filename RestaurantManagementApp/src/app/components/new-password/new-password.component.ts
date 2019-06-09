import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import { Component } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';

import {ChangePassword} from '../../models/change-password.model';
import {UserAccountDataStorageService} from '../../services/data-storage/user-account-data-storage.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent {
  isDisabled = false;

  constructor(private userAccountDataStorageService: UserAccountDataStorageService,
              private toastr: ToastrManager,
              private router : Router) { }

  resetPassword(form: NgForm) {
    this.isDisabled  = true;
    if (form.value.newPassword.length < 6) {
      this.toastr.errorToastr('Password must be at least 6 characters long',
        'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
      return;
    }

    if ( form.value.newPassword !==  form.value.confirmPassword ) {
      this.isDisabled = false;
      this.toastr.errorToastr(
        'Passwords do not match',
        'Error',
        {
          toastTimeout: 20000,
          newestOnTop: true,
          showCloseButton: true
        });

    } else {
      this.userAccountDataStorageService.newPassword(
        new ChangePassword(
          '',
          JSON.parse(JSON.stringify(localStorage.getItem('userNameForResetPassword'))),
          '',
          form.value.newPassword,
          form.value.passwordResetCode
        )
      ).subscribe((data: any) => {
        if (data === 'User not found') {
          this.isDisabled = false;
          this.toastr.errorToastr(
            data,
            'Error',
            {
              toastTimeout: 20000,
              newestOnTop: true,
              showCloseButton: true
            });
          return;
        } else if (data.Succeeded) {
          this.toastr.successToastr(
            'Password reset successfully, log in here',
            'Success',
            {
              toastTimeout: 20000,
              newestOnTop: true,
              showCloseButton: true
            });
          this.router.navigate(['/login']);
        } else {
          this.isDisabled = false;
          this.toastr.errorToastr(
            'Token invalid or has expired',
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
}
