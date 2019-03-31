import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Order} from '../../../models/order.model';
import {PointOfSaleService} from '../../../services/point-of-sale.service';
import {TableDataStorageService} from '../../../services/table-data-storage.service';


@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
  order: Order;

  constructor(private pointOfSaleService: PointOfSaleService,
              private dataStorageService: TableDataStorageService,
              private router: Router) {
  }

  ngOnInit() {
    this.order = this.pointOfSaleService.order;
  }

  discardOrder() {
    const dialog = confirm('Delete this order?\n' +
      'You will lose any kind of data associated with the current order!');
    if (dialog === true) {
      this.confirmEvent();
    }
  }

  confirmEvent() {
    this.pointOfSaleService.clearOrders();
    this.pointOfSaleService.totalPrice = 0;
    this.pointOfSaleService.totalQuantity = 0;
    this.router.navigate(['our-offers/regulars']);
    this.pointOfSaleService.deleteOrder(this.order);
    this.dataStorageService.deleteOrder(this.order).subscribe();
  }




  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('document.URL,', '_blank');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title></title>
        <style>
 @media print
 {
  header nav, footer {
      display: none;
  }
  @page {
      margin: 0.5cm;
  }
  .intro{
  text-align: center;
  }
  .hodoo{
    font-family:"Inconsolata";
    font-size: 4vw;
    text-align: center;
    padding-top: 10px;
  }
  .date-time{
   font-family:"Inconsolata";
   font-size: 4vw;
   display: inline-block;
   text-align:center;
  }
.id{
   font-family:"Inconsolata";
   font-size: 4vw;
   display: inline;
   text-align: center;
}
.name, .price, .quantity, .equal, .sub-total, .mul{
    font-family:"Inconsolata";
    font-size: 3vw;
    padding-top: 2px;
    padding-bottom: 2px;
    display: inline;
    text-align:left;
  }
  .main{
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
  }
  .name{
  text-align:left;
  }
.intro{
    margin-top: 15px;
  }


.sub-total{
text-align: right;
}

  .choosing-hodoo{
    font-family:"Inconsolata",cursive;
    font-size: 3vw;
    padding-top: 15px;
    padding-bottom: 20px;
    text-align: center;
  }
  .total-div{
    padding-bottom: 8px;
    padding-top: 8px;
    text-align:center;
  }
  .total{
    font-family:"Inconsolata";
    font-size: 4vw;
     display: inline-block;
  }
  .total-bdt{
    font-family:"Inconsolata";
    font-size: 4vw;
     display: inline-block;
  }
   .change-div{
    padding-top: 8px;
    padding-bottom: 8px;
    text-align: center;
  }
  .change-bdt{
    font-family:"Inconsolata";
    font-size: 4vw;
     display: inline-block;
  }
  .change-cash{
    font-family:"Inconsolata";
    font-size: 4vw;
    display: inline-block;
  }
.tendered-div{
    padding-top: 8px;
    padding-bottom: 8px;
    text-align: center;
  }
  .tendered{
    font-family:"Inconsolata";
    font-size: 4vw;
    display: inline-block;
  }
  .tendered-bdt{
    font-family:"Inconsolata";
    font-size: 4vw;
    display: inline-block;
  }
  .table-no{
    text-align: center;
    font-family:"Inconsolata";
    font-size: 4vw;
  }
 }
</style>
        </head>
     <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }


  nextOrder() {
    this.pointOfSaleService.clearOrders();
    this.pointOfSaleService.totalPrice = 0;
    this.pointOfSaleService.totalQuantity = 0;
    this.router.navigate(['our-offers']);
  }

}
