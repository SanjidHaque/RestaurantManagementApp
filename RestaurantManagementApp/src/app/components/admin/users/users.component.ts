import {Component, OnInit} from '@angular/core';

import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserAccount} from '../../../models/user-account.model';
import {ModifiedUserModel} from '../../../models/modified-user.model';
import {Role} from '../../../models/role.model';
import {AuthService} from '../../../services/shared/auth.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  isDisabled = false;
  user: UserAccount;
  term = '';
  modifiedUser: ModifiedUserModel[] = [];
  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  roles : Role[] = [];


  constructor(private authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {
  //  this.resetForm();
    this.route.data.
    subscribe(
      ( data: Date) => {
      //  this.roles = data['roles'];
      }
    );
  }



  // resetForm(form?: NgForm) {
  //   if (form != null) {
  //     form.reset();
  //   }
  //   this.userAccount = {
  //     UserName: '',
  //     Password: '',
  //     Email: ''
  //   }
  // }


  OnSubmit(form: NgForm) {
    this.isDisabled = true;
    const dateTime = new Date().toLocaleString();
    this.authService.registerUser(form.value.UserName,
      form.value.Password, form.value.Email, form.value.roleName, dateTime)
      .subscribe((data: any) => {

        if (data.Succeeded === true) {
          this.isDisabled = false;
          const newUser = new ModifiedUserModel(
            form.value.UserName,
            form.value.Email,
            form.value.roleName,
            dateTime);
         // this.authService.getUsers()
         //   .subscribe(
         //     (userAccounts: any) => {
         //       this.modifiedUser = userAccounts;
         //       alert('Registration Successful!');
         //     //  this.resetForm(form);
         //     }
         // );

        } else {
          this.isDisabled = false;
          alert(data.Errors[0]);
        }

      });
  }


  // deleteUserAccount(userAccount: ModifiedUserModel, index: number) {
  //   const dialog = confirm('Delete this userAccount?\n' +
  //     'You will lose any kind of data associated with the current userAccount!');
  //   if (dialog === true) {
  //     this.authService.deleteUserAccount(userAccount).subscribe(
  //       (data: any) => {
  //         this.authService.getUsers()
  //           .subscribe(
  //             (userAccounts: any) => {
  //               this.modifiedUser = userAccounts;
  //             }
  //           );
  //       }
  //     )
  //   }
  // }

}
