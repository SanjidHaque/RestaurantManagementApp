import {Component, OnInit} from '@angular/core';
import {UserModel} from '../models/user.model';
import {NgForm} from '@angular/forms';
import {UserService} from '../services/user.service';
import {Role} from '../models/role.model';
import {ActivatedRoute} from '@angular/router';
import {ModifiedUserModel} from '../models/modified-user.model';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isDisabled = false;
  user: UserModel;
  term = '';
  modifiedUser: ModifiedUserModel[] = [];
  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  roles : Role[] = [];
  subscription: Subscription;


  constructor(private userService: UserService,
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
    this.userService.registerUser(form.value.UserName,
      form.value.Password, form.value.Email, form.value.roleName, dateTime)
      .subscribe((data: any) => {

        if (data.Succeeded === true) {
          this.isDisabled = false;
          const newUser = new ModifiedUserModel(
            form.value.UserName,
            form.value.Email,
            form.value.roleName,
            dateTime);
         this.userService.getUsers()
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
      this.userService.deleteUser(user).subscribe(
        (data: any) => {
          this.userService.getUsers()
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
