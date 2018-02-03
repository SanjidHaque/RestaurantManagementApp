import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../../shared/data-storage.service';
import {OurOffersService} from '../../our-offers/our-offers.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-bill-of-materials',
  templateUrl: './bill-of-materials.component.html',
  styleUrls: ['./bill-of-materials.component.scss']
})
export class BillOfMaterialsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService) { }

  ngOnInit() {
  }

  goToSummary() {
    this.router.navigate(['admin/reports/inventories'])
  }
  goToCashFlow() {
    this.router.navigate(['admin/reports/cash-flow'])
  }
}
