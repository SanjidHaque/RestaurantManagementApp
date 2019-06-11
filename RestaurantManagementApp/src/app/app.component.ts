import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserAccountDataStorageService} from './services/data-storage/user-account-data-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  userName: string;
  opened: boolean;

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
