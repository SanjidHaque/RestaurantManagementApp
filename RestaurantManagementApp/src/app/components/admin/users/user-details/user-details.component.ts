import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {UserAccount} from '../../../../models/user-account.model';
import {UserAccountDataStorageService} from '../../../../services/data-storage/user-account-data-storage.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  userId: string;
  userAccount: UserAccount;
  userAccounts: UserAccount[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrManager,
              private userAccountDataStorageService: UserAccountDataStorageService) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.userId = params['user-account-id'];
        }
      );
  }

  ngOnInit() {
    this.route.data.subscribe(
      ( data: UserAccount[]) => {
        this.userAccounts = data['userAccounts'];
        this.userAccount = this.userAccounts.find(x => x.Id === this.userId);

        if (this.userAccount === undefined) {
          this.toastr.errorToastr('User is not found', 'Error', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          this.router.navigate(['admin/userAccounts']);
        }
      }
    );
  }

  deleteUser() {
    const dialog = confirm('Delete this userAccount account?\n' +
      'You will lose any kind of data associated with the current userAccount!');
    if (dialog === true) {
      this.confirmEvent();
    }
  }

  confirmEvent() {
    this.userAccountDataStorageService.deleteUserAccount(this.userId).subscribe(
      (data: any) => {
        this.toastr.successToastr('Removed from shop', 'Success', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        this.router.navigate(['admin/userAccounts']);
      });
  }

}