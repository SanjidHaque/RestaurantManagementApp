import { Component, OnInit } from '@angular/core';
import {UserAccount} from '../../../../models/user-account.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ToastrManager} from 'ng6-toastr-notifications';
import {UserAccountDataStorageService} from '../../../../services/data-storage/user-account-data-storage.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

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
          this.userAccountId = params['userAccountId'];
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
          this.router.navigate(['admin/userAccounts']);
        }
      }
    );
  }

  editUserAccount() {
    // this.userAccountDataStorageService.editUserAccount( {})
  }

}
