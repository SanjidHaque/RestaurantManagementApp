import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/shared/auth.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  isDisabled = false;
  constructor(private authService: AuthService,
              private router : Router) { }

  ngOnInit() {
  }

  resetPassword(form: NgForm) {
    this.isDisabled  = true;
    if ( form.value.password !==  form.value.confirmPassword ) {
      this.isDisabled = false;
      alert('Your password did not match!');
      form.controls['password'].reset();
      form.controls['confirmPassword'].reset();
    } else {
      this.authService.newPassword(form.value.password, form.value.code)
        .subscribe((data: any) => {
        if (data === 'Successful') {
          alert('password changed successfully! You can login now.');
          this.router.navigate(['/login']);
        } else {
          alert('Incorrect reset code! Try again.');
        }
        });
    }
  }
}
