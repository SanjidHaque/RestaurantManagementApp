import {Component, DoCheck, OnInit} from '@angular/core';
import {UserModel} from '../shared/user.model';
import {NgForm} from '@angular/forms';
import {UserService} from '../user.service';
import {RoleModel} from '../shared/role.model';
import {ActivatedRoute} from '@angular/router';
import {ModifiedUserModel} from '../shared/modified-user.model';
import {Subscription, Subject} from 'rxjs';
import {Table} from '../shared/table.model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, DoCheck {

  isDisabled = false;
  user: UserModel;
  term = '';
  modifiedUser: ModifiedUserModel[] = [];
  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  roles : RoleModel[] = [];
  totalUsers: number;
  subscription: Subscription;


  constructor(private userService: UserService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.resetForm();
    this.route.data.
    subscribe(
      ( data: RoleModel[]) => {
        this.roles = data['roles'];
      }
    );
    this.route.data.
    subscribe(
      ( data: ModifiedUserModel[]) => {
        this.userService.modifiedUser = data['users'];
      }
    );
    this.modifiedUser = this.userService.modifiedUser;
    this.subscription = this.userService.modifiedUserChanged
      .subscribe(
        (modifiedUsers: ModifiedUserModel[]) => {
          this.modifiedUser = modifiedUsers;
        }
      );
    this.totalUsers = this.modifiedUser.length;
  }

  ngDoCheck() {
    this.totalUsers = this.modifiedUser.length;
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
          const newUser =
            new ModifiedUserModel(form.value.UserName,  form.value.Email,
              form.value.roleName, dateTime);
          this.userService.addToUserList(newUser);
          alert('Registration Successful!');
          this.resetForm(form);
        } else {
          alert(data.Errors[0]);
        }

      });
  }

  deleteUser(user: ModifiedUserModel, index: number) {
    const dialog = confirm('Delete this user?\n' +
      'You will lose any kind of data associated with the current user!');
    if (dialog === true) {
      this.modifiedUser.splice(index, 1);
      this.userService.deleteUser(user, index);
    }
  }

}
