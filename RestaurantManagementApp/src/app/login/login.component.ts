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
  isDisabled = false;
  constructor(private userService : UserService,
              private router : Router) { }

  ngOnInit() {

  }

  OnSubmit() {
    this.isDisabled = true;
     this.userService.
     userAuthentication(this.form.value.userName, this.form.value.password)
       .subscribe((data : any) => {


         localStorage.setItem('userToken', data.access_token);
         localStorage.setItem('userRoles', data.role);
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
