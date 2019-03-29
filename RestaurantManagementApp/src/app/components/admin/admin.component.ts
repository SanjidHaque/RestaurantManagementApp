import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {AdminService} from '../../services/admin.service';
import {Inventory} from '../../models/inventory.model';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private adminService: AdminService) { }

  ngOnInit() {
   this.route.data
     .subscribe(
       (data: Inventory[]) => {
         this.adminService.inventories = data['inventories'];
       }
     );
  }

}
