import { Component, OnInit } from '@angular/core';
import {UserAccount} from '../../../../models/user-account.model';
import {Role} from '../../../../models/role.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ToastrManager} from 'ng6-toastr-notifications';
import {UserAccountDataStorageService} from '../../../../services/data-storage/user-account-data-storage.service';
import {ChangePassword} from '../../../../models/change-password.model';
import {NgForm} from '@angular/forms';
import {conditionallyCreateMapObjectLiteral} from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-change-password-by-admin',
  templateUrl: './change-password-by-admin.component.html',
  styleUrls: ['./change-password-by-admin.component.scss']
})
export class ChangePasswordByAdminComponent implements OnInit {

  isDisabled = false;

  userAccountId: string;
  userAccount: UserAccount;
  userAccounts: UserAccount[] = [];


  constructor(private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrManager,
              private userAccountDataStorageService: UserAccountDataStorageService) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.userAccountId = params['user-account-id'];
        }
      );
  }

  ngOnInit() {
    this.route.data.subscribe(
      ( data: UserAccount[]) => {
        this.userAccounts = data['userAccounts'];
        this.userAccount = this.userAccounts.find(x => x.Id === this.userAccountId);

        if (this.userAccount === undefined) {
          this.toastr.errorToastr('User is not found', 'Error', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          this.router.navigate(['admin/user-accounts']);
        }
      }
    );
  }

  changePasswordByAdmin(form: NgForm) {
    if (form.value.newPassword !==  form.value.confirmNewPassword) {
      this.toastr.errorToastr('Password do not match', 'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      return;
    }
    if (form.value.newPassword.length < 6) {
      this.toastr.errorToastr('Password must be at least 6 characters long',
        'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      return;
    }
    this.isDisabled = true;
    this.userAccountDataStorageService.changePasswordByAdmin(
      new ChangePassword(
        this.userAccountId,
        '',
        form.value.newPassword
      )
    ).subscribe(
      (data: any) => {
          this.toastr.successToastr('Password changed successfully', 'Success', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          this.router.navigate(['admin/user-accounts/', this.userAccountId]);
      }
    )
  }

}
