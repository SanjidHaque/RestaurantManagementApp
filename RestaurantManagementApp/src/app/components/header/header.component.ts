import {Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public userName: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.userName = JSON.parse(JSON.stringify(localStorage.getItem('userNameForLogin')));
  }

  logOut() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userNameForLogin');
    this.router.navigate(['/login']);
  }
}
