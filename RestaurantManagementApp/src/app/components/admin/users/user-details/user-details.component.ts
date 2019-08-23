import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {UserAccount} from '../../../../models/user-account.model';
import {UserAccountDataStorageService} from '../../../../services/data-storage/user-account-data-storage.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  isDisabled = false;
  userAccount: UserAccount;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrManager,
              private userAccountDataStorageService: UserAccountDataStorageService) { }

  ngOnInit() {
    this.route.data.subscribe(
      ( data: Data) => {
        this.userAccount = data['userAccount'];

        if (this.userAccount === undefined || this.userAccount === null) {
          this.toastr.errorToastr('User is not found', 'Error');
          this.router.navigate(['admin/user-accounts']);
        }
      }
    );
  }

  deleteUser() {
    const dialog = confirm('Delete this user account?\n' +
      'You will lose any kind of data associated with the current user account!');
    if (dialog === true) {
      this.confirmEvent();
    }
  }

  confirmEvent() {
    this.userAccountDataStorageService.deleteUserAccount(this.userAccount.Id).subscribe(
      (data: any) => {

        if (data.StatusText !== 'Success') {
          this.isDisabled = false;
          this.toastr.errorToastr(data.StatusText, 'Error');
          return;
        }

        this.toastr.successToastr('User removed', 'Success');
        this.router.navigate(['admin/user-accounts']);
      });
  }

}
