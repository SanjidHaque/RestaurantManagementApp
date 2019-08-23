import {NgForm} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

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

  userAccount: UserAccount;
  roles: Role[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrManager,
              private userAccountDataStorageService: UserAccountDataStorageService) { }

  ngOnInit() {
    this.route.data.subscribe(
      ( data: Data) => {
        this.roles = data['roles'];
        this.userAccount = data['userAccount'];

        if (this.userAccount === undefined || this.userAccount === null) {
          this.toastr.errorToastr('User is not found', 'Error');
          this.router.navigate(['admin/user-accounts']);
        }
      }
    );
  }

  editUserAccount(form: NgForm) {
    this.isDisabled = true;
    this.userAccountDataStorageService.editUserAccount(new UserAccount(
      this.userAccount.Id,
      form.value.userName,
      form.value.fullName,
      form.value.email,
      '',
      form.value.phoneNumber,
      '',
      form.value.roleName,
    )).subscribe(
      (result: any) => {
        if (result.StatusText === 'Resource not found') {
          this.isDisabled = false;
          this.toastr.errorToastr(result.StatusText, 'Error');
          return;

        } else if (!result.Succeeded) {
          this.isDisabled = false;
          this.toastr.errorToastr(result.Errors[0], 'Error');
          return;

        } else {
          this.toastr.successToastr('Information updated', 'Success');
          this.router.navigate(['admin/user-accounts/', this.userAccount.Id])
        }
      }
    );
  }

}
