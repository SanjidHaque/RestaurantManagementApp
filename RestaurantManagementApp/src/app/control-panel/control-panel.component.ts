import { Component, OnInit } from '@angular/core';
import {Inventory} from '../shared/inventory.model';
import {ActivatedRoute, Router} from '@angular/router';
import {OurOffersService} from '../our-offers/our-offers.service';
import {UserService} from '../user.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
  public userName: string;
  constructor(private _ourOfferService: OurOffersService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {
   this.userName
      = JSON.parse(JSON.stringify(localStorage.getItem('userName')));
}
  logOut() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }

}
