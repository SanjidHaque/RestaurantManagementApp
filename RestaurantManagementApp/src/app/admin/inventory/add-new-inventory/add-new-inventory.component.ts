import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import { Uuid } from 'ng2-uuid';
import {Inventory} from '../../../shared/inventory.model';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';

@Component({
  selector: 'app-add-new-inventory',
  templateUrl: './add-new-inventory.component.html',
  styleUrls: ['./add-new-inventory.component.scss']
})

export class AddNewInventoryComponent implements OnInit {
  uuidCodeOne = '';
  unit : number;
  defaultUnit = 'Kilogram';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private uuid: Uuid,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService) {
  }

  ngOnInit() {
  }
 // @ViewChild('amountInput') amountInputRef: ElementRef;
  onAddNewItem(form: NgForm) {
      const id = this.uuid.v1();
      const name = form.value.name;
      const quantity = form.value.quantity;
      if ( form.value.unit === 'Kilogram' ) {
        this.unit = 1;
      }
      if ( form.value.unit === 'Litre') {
      this.unit = 2;
      }
      if ( form.value.unit === 'Piece') {
      this.unit = 3;
      }
      if ( form.value.unit === 'Bottle') {
      this.unit = 4;
      }
     // const w = this.amountInputRef.nativeElement.value;
      const price = form.value.price;
      const newItem = new Inventory(id, name, quantity, null , price);
      this._ourOfferService.addToInventoryList(newItem);
      this._dataStorageService.addNewInventoryItem(newItem);

      form.controls['quantity'].reset();
      form.controls['name'].reset();
      form.controls['price'].reset();

  }



  onCancel() {
    this.router.navigate(['admin/inventory']);

  }
}
