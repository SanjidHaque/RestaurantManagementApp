import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  isDisabled = false;

  constructor(private userService: UserService,
              private router : Router) { }

  ngOnInit() {
  }

  getResetCode(form: NgForm) {
    this.isDisabled = true;
    this.userService.resetPassword(form.value.UserName).subscribe((data: any) => {
       if (data === 'User Name Found') {
        form.reset();
        alert('A password recovery code has sent to your email');
        this.router.navigate(['/new-password']);
      } else {
        alert('Incorrect user name!');
      }
    });

  }
}
