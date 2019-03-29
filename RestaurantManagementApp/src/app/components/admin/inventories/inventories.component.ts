import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AdminService} from '../../../services/admin.service';
import {Inventory} from '../../../models/inventory.model';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.scss']
})
export class InventoriesComponent implements OnInit {
  constructor(private route: ActivatedRoute,
              private adminService: AdminService) { }

  ngOnInit() {

  }
}
