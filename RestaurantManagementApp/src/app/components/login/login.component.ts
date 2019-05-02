import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('userLoginForm') form: NgForm;

  isLoginError = false;
  isDisabled = false;
  constructor(private authService: AuthService,
              private router : Router) { }

  ngOnInit() {}

  OnSubmit() {
    if (this.form.value.userName === '' ||  this.form.value.password === '') {
      return;
    }
    this.isDisabled = true;
     this.authService.
     userAuthentication(this.form.value.userName, this.form.value.password)
       .subscribe(
         (data : any) => {
         localStorage.setItem('userToken', data.access_token);
         localStorage.setItem('userRoles', data.role);
         localStorage.setItem('userName', this.form.value.userName);
         if (this.authService.roleMatch(['Cashier'])) {
           this.router.navigate(['/pos']);
         } else {
           this.router.navigate(['/pos']);
         }

       },
       (err : HttpErrorResponse) => {
         this.isLoginError = true;
         if (this.isLoginError === true ) {
           alert('UserAccount name or password is incorrect!');
           this.isDisabled = false;
         }
       });
  }
}
