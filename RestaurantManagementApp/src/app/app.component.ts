import {Router} from '@angular/router';
import {Component, HostListener, OnInit, ViewChild} from '@angular/core';

import {UserAccountDataStorageService} from './services/data-storage/user-account-data-storage.service';
import {MatSidenav} from '@angular/material';
import {PointOfSaleService} from './services/shared/point-of-sale.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userName = '';
  screenWidth: number;
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

  constructor(public router: Router,
              public pointOfSaleService: PointOfSaleService,
              public userDataStorageService: UserAccountDataStorageService) {
    this.getCurrentScreenSize();
    this.userName = JSON.parse(JSON.stringify(localStorage.getItem('userNameForLogin')));
  }

  logOut() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userNameForLogin');
    this.pointOfSaleService.userName = '';
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
