import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStorageService} from '../../shared/data-storage.service';
import {OurOffersService} from '../our-offers.service';
import { Uuid } from 'ng2-uuid';
import {Order} from '../../shared/order.model';


@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
  change = 0;
  order: Order;

  constructor(private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private router: Router,
              private route: ActivatedRoute,
              private uuid: Uuid) {
  }

  ngOnInit() {
    this.change = this._ourOfferService.orders.Change;
    this.order = this._ourOfferService.orders;
  }


  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title></title>
          <style>
          //........Customized style......
         </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();



  }


  nextOrder() {
    this._ourOfferService.clearOrders();
    this._ourOfferService.TotalPrice = 0;
    this._ourOfferService.totalQuantity = 0;
    this.router.navigate(['our-offers']);
  }

}
