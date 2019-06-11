import {Router} from '@angular/router';
import {Component, HostListener, OnInit, ViewChild} from '@angular/core';

import {UserAccountDataStorageService} from './services/data-storage/user-account-data-storage.service';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  userName: string;
  opened: boolean;
  screenWidth: number;

  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;


  constructor(private router: Router,
              private userDataStorageService: UserAccountDataStorageService) {
    this.getCurrentScreenSize();
  }

  ngOnInit() {
    this.userName = JSON.parse(JSON.stringify(localStorage.getItem('userNameForLogin')));
  }

  logOut() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userNameForLogin');
    this.router.navigate(['/login']);
  }



  @HostListener('window:resize', ['$event'])
  getCurrentScreenSize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth >= 768 && this.sidenav !== undefined) {
      this.sidenav.close();
    }
  }
}
