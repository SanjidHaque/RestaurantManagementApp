import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
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
  isLoginError = false;
  constructor(private userService : UserService,
              private router : Router) { }

  ngOnInit() {

  }

  OnSubmit(form: NgForm) {
     this.userService.userAuthentication(form.value.userName, form.value.password)
       .subscribe((data : any) => {
       console.log(data.json().access_token);
       console.log(data.json().role);
         localStorage.setItem('userToken', data.json().access_token);
         localStorage.setItem('userRoles', data.json().role);
         localStorage.setItem('userName', form.value.userName);
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
