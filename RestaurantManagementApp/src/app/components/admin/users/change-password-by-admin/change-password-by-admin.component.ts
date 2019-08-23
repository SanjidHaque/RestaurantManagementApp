import {NgForm} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {UserAccount} from '../../../../models/user-account.model';
import {ChangePassword} from '../../../../models/change-password.model';
import {UserAccountDataStorageService} from '../../../../services/data-storage/user-account-data-storage.service';

@Component({
  selector: 'app-change-password-by-admin',
  templateUrl: './change-password-by-admin.component.html',
  styleUrls: ['./change-password-by-admin.component.scss']
})
export class ChangePasswordByAdminComponent implements OnInit {
  isDisabled = false;
  userAccount: UserAccount;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrManager,
              private userAccountDataStorageService: UserAccountDataStorageService) {}

  ngOnInit() {
    this.route.data.subscribe(
      ( data: Data) => {
        this.userAccount = data['userAccount'];

        if (this.userAccount === null || this.userAccount === undefined) {
          this.toastr.errorToastr('User is not found', 'Error');
          this.router.navigate(['admin/user-accounts']);
        }
      }
    );
  }

  changePasswordByAdmin(form: NgForm) {
    if (form.value.newPassword !==  form.value.confirmNewPassword) {
      this.toastr.errorToastr('Password do not match', 'Error');
      return;
    }
    if (form.value.newPassword.length < 6) {
      this.toastr.errorToastr('Password must be at least 6 characters long');
      return;
    }

    this.isDisabled = true;
    this.userAccountDataStorageService.changePasswordByAdmin(
      new ChangePassword(
        this.userAccount.Id,
        '',
        '',
        form.value.newPassword,
        ''
      )
    ).subscribe(
      (data: any) => {
        if (data.StatusText !== 'Success') {
          this.isDisabled = false;
          this.toastr.errorToastr(data.StatusText, 'Error');
          return;
        }

        this.toastr.successToastr('Password changed successfully', 'Success');
        this.router.navigate(['admin/user-accounts/', this.userAccount.Id]);
      }
    )
  }

}
