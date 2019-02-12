import {Component, OnInit} from '@angular/core';
import {Inventory} from '../../shared/inventory.model';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  ngOnInit() {
  }

}
