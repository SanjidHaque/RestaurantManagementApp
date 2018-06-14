import {Component, OnInit} from '@angular/core';
import {Inventory} from '../../shared/inventory.model';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  public inventories: Inventory[] ;
  subscription: Subscription;


  constructor() {
  }

  ngOnInit() {
  }
}
