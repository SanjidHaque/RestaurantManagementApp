import {Component, OnInit} from '@angular/core';

import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {User} from '../../../models/user';
import {ModifiedUserModel} from '../../../models/modified-user.model';
import {Role} from '../../../models/role.model';
import {AuthService} from '../../../services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isDisabled = false;
  user: User;
  term = '';
  modifiedUser: ModifiedUserModel[] = [];
  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  roles : Role[] = [];
  subscription: Subscription;


  constructor(private authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.resetForm();
    this.route.data.
    subscribe(
      ( data: Date) => {
        this.roles = data['roles'];
        this.modifiedUser = data['users'];
      }
    );
  }



  resetForm(form?: NgForm) {
    if (form != null) {
      form.reset();
    }
    this.user = {
      UserName: '',
      Password: '',
      Email: ''
    }
  }


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
         this.authService.getUsers()
           .subscribe(
             (users: any) => {
               this.modifiedUser = users;
               alert('Registration Successful!');
               this.resetForm(form);
             }
         );

        } else {
          this.isDisabled = false;
          alert(data.Errors[0]);
        }

      });
  }


  deleteUser(user: ModifiedUserModel, index: number) {
    const dialog = confirm('Delete this user?\n' +
      'You will lose any kind of data associated with the current user!');
    if (dialog === true) {
      this.authService.deleteUser(user).subscribe(
        (data: any) => {
          this.authService.getUsers()
            .subscribe(
              (users: any) => {
                this.modifiedUser = users;
              }
            );
        }
      )
    }
  }

}
