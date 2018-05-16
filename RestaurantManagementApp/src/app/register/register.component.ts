import {Component, DoCheck, OnInit} from '@angular/core';
import {UserModel} from '../shared/user.model';
import {NgForm} from '@angular/forms';
import {UserService} from '../user.service';
import {RoleModel} from '../shared/role.model';
import {ActivatedRoute} from '@angular/router';
import {ModifiedUserModel} from '../shared/modified-user.model';
import {Subject} from 'rxjs/Subject';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, DoCheck {

  user: UserModel;
  modifiedUser: ModifiedUserModel[] = [];
  modifiedUserChanged =  new Subject<ModifiedUserModel[]>();
  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  roles : RoleModel[] = [];
  totalUsers: number;
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
        this.modifiedUser = data['users'];
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

    this.userService.registerUser(form.value.UserName,
      form.value.Password, form.value.Email, form.value.roleName )
      .subscribe((data: any) => {

        if (data.json().Succeeded === true) {
          const dateTime = new Date().toLocaleString();
          const newUser =
            new ModifiedUserModel(form.value.UserName,  form.value.Email,
              form.value.roleName, dateTime);
          this.modifiedUser.push(newUser);
          this.modifiedUserChanged.next(this.modifiedUser.slice());
          alert('Registration Successful!');
          this.resetForm(form);
        } else {
          alert(data.json().Errors[0]);
        }

      });
  }

  deleteUser(user: ModifiedUserModel, index: number) {

      this.modifiedUser.splice(index, 1);
      this.userService.deleteUser(user);

  }


}
