import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/shared/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  isDisabled = false;

  constructor(private authService: AuthService,
              private router : Router) { }

  ngOnInit() {
  }

  getResetCode(form: NgForm) {
    this.isDisabled = true;
    this.authService.resetPassword(form.value.UserName).subscribe((data: any) => {
       if (data === 'UserAccount Name Found') {
         this.isDisabled = false;
        form.reset();
        alert('A password recovery code has sent to your email');
        this.router.navigate(['/new-password']);
      } else {
         this.isDisabled = false;
        alert('Incorrect userAccount name!');
      }
    });

  }
}
