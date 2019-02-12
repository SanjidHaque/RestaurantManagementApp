import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('userLoginForm') form: NgForm;

  isLoginError = false;
  isDisabled: boolean;
  constructor(private userService : UserService,
              private router : Router) { }

  ngOnInit() {
    this.form.value.userName = '';
    this.form.value.password = '';

    if (this.form.value.userName === '' && this.form.value.password === '') {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

  OnSubmit() {
    this.isDisabled = false;
     this.userService.userAuthentication(this.form.value.userName, this.form.value.password)
       .subscribe((data : any) => {
       console.log(data.json().access_token);
       console.log(data.json().role);
         localStorage.setItem('userToken', data.json().access_token);
         localStorage.setItem('userRoles', data.json().role);
         localStorage.setItem('userName', this.form.value.userName);
         if (this.userService.roleMatch(['Cashier'])) {
           this.router.navigate(['our-offers/regulars']);
         } else {
           this.router.navigate(['/control-panel']);
         }

       },
       (err : HttpErrorResponse) => {
         this.isLoginError = true;
         if (this.isLoginError === true ) {
           alert('Incorrect username or password');
         }
       });
  }
}
