import {NgForm} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {Role} from '../../../../models/role.model';
import {UserAccount} from '../../../../models/user-account.model';
import {UserAccountDataStorageService} from '../../../../services/data-storage/user-account-data-storage.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  isDisabled = false;

  userAccountId: string;
  userAccount: UserAccount;
  userAccounts: UserAccount[] = [];
  roles: Role[] = [];

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
        this.roles = data['roles'];
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

  editUserAccount(form: NgForm) {
    this.isDisabled = true;
    this.userAccountDataStorageService.editUserAccount(new UserAccount(
      this.userAccountId,
      form.value.userName,
      form.value.fullName,
      form.value.email,
      '',
      form.value.phoneNumber,
      '',
      form.value.roleName,
    )).subscribe(
      (result: any) => {
        if (result.Succeeded) {
          this.toastr.successToastr('Information updated', 'Success', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          form.reset();
          this.router.navigate(['admin/user-accounts/', this.userAccountId])
        } else {
          this.toastr.errorToastr(result.Errors[0], 'Error', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          this.isDisabled = false;

        }
      }
    );
  }

}
