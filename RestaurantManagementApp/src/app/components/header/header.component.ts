import {Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {UserAccountDataStorageService} from '../../services/data-storage/user-account-data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName: string;

  constructor(private router: Router,
              private userDataStorageService: UserAccountDataStorageService) {}

  ngOnInit() {
    this.userName = JSON.parse(JSON.stringify(localStorage.getItem('userNameForLogin')));
  }

  logOut() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userNameForLogin');
    this.router.navigate(['/login']);
  }
}
