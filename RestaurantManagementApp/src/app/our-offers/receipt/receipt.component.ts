import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStorageService} from '../../shared/data-storage.service';
import {OurOffersService} from '../our-offers.service';
import { Uuid } from 'ng2-uuid';
import {Order} from '../../shared/order.model';
import * as jsPDF from 'jspdf'


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
    font-size: 21px;
    text-align: center;
    /*padding-left: 90px;*/
    padding-top: 10px;
  }
  .date-time{
   font-family:"Inconsolata";
   font-size: 21px;
   display: inline-block;
   padding-right: 66px;
   text-align:right;
  }
.id{
   font-family:"Inconsolata";
   font-size: 21px;
   display: inline;
   padding-left: -25px;
  text-align: right;
}
.name, .price, .quantity, .equal, .sub-total, .mul{
    font-family:"Inconsolata";
    font-size: 20px;
    padding-top: 2px;
    padding-bottom: 2px;
    display: inline;
    text-align:left;
  }
  .main{
  padding-top: 10px;
  padding-bottom: 10px;
  /*padding-left: 5px;*/
  text-align: center;
  }
  .name{
  text-align:left;
  }
.intro{
    margin-top: 15px;
  }
.price{
 /* padding-left: 60px;*/
  }
.sub-total{
/*padding-left: 70px;*/
text-align: right;
}
.quantity{
   /* padding-left: 70px;*/
  }
  .mul{
   /* padding-left: 90px;*/
  }
  .equal{
  /*padding-left: 50px;*/
  }
  .choosing-hodoo{
    font-family:"Inconsolata";
    font-size: 21px;
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
    font-size: 24px;
     display: inline-block;
  }
  .total-bdt{
    font-family:"Inconsolata";
    font-size: 24px;
     display: inline-block;
  }
   .change-div{
    padding-top: 8px;
    padding-bottom: 8px;
    text-align: center;
  }
  .change-bdt{
    font-family:"Inconsolata";
    font-size: 21px;
     display: inline-block;
  }
  .change-cash{
    font-family:"Inconsolata";
    font-size: 21px;
  /*  padding-left: 23px;*/
    display: inline-block;
  }
.tendered-div{
    padding-top: 8px;
    padding-bottom: 8px;
    text-align: center;
  }
  .tendered{
    font-family:"Inconsolata";
    font-size: 21px;
    display: inline-block;
  }
  .tendered-bdt{
    font-family:"Inconsolata";
    font-size: 21px;
    display: inline-block;
  }
  .table-no{
    text-align: center;
    font-family:"Inconsolata";
    font-size: 21px;

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
    this._ourOfferService.clearOrders();
    this._ourOfferService.TotalPrice = 0;
    this._ourOfferService.totalQuantity = 0;
    this.router.navigate(['our-offers']);
  }

}
