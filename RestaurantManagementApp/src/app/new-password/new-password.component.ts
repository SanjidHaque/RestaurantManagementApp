import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../user.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  constructor(private userService: UserService,
              private router : Router) { }

  ngOnInit() {
  }

  resetPassword(form: NgForm) {
    if ( form.value.password !==  form.value.confirmPassword ) {
      alert('Your password did not match!');
      form.controls['password'].reset();
      form.controls['confirmPassword'].reset();
    } else {
      this.userService.newPassword(form.value.password, form.value.code)
        .subscribe((data: any) => {
        console.log(data.json());
        if (data.json() === 'Successful') {
          alert('password changed successfully! You can login now.');
          this.router.navigate(['/login']);
        } else {
          alert('Incorrect reset code! Try again.');
        }
        });
    }
  }
}
