import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public userName: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.userName = JSON.parse(JSON.stringify(localStorage.getItem('userName')));
  }

  logOut() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }
}
