import { Component, OnInit } from '@angular/core';
import {Order} from '../shared/order.model';
import {ChefServiceService} from '../chef/chef-service.service';

@Component({
  selector: 'app-checking-order',
  templateUrl: './checking-order.component.html',
  styleUrls: ['./checking-order.component.scss']
})
export class CheckingOrderComponent implements OnInit {
  orderAccept = false;

  constructor(private _chefService: ChefServiceService ) { }

  ngOnInit() {
   this.orderAccept = this._chefService.orderAccepted;
  }

}
