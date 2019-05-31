import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OrderedItem} from '../../../models/ordered-item.model';
import {Order} from '../../../models/order.model';
import {Inventory} from '../../../models/inventory.model';
import {Table} from '../../../models/table.model';
import {TableDataStorageService} from '../../../services/data-storage/table-data-storage.service';
import {PointOfSaleService} from '../../../services/shared/point-of-sale.service';
import {Setting} from '../../../models/setting.model';
import {OrderDataStorageService} from '../../../services/data-storage/order-data-storage.service';
import {ToastrManager} from 'ng6-toastr-notifications';
import {FoodItem} from '../../../models/food-item.model';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  isDisabled = false;
  userName: string;

  tableId: number;
  table: Table;
  tables: Table[] = [];

  setting: Setting;
  order: Order;
  foodItems: FoodItem[] = [];

  mergedArrayOfOrderedItems: OrderedItem[] = [];
  tendered = 0;

  constructor(private pointOfSaleService: PointOfSaleService,
              private orderDataStorageService: OrderDataStorageService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrManager) {
    this.route.params.subscribe((params: Params) => this.tableId = +params['table-id']);
  }

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.tables = data['tables'];
      this.setting = data['setting'];
      this.foodItems = data['foodItems'];

      this.table = this.tables.find(x => x.Id === this.tableId);

      if (this.table === undefined) {
        this.toastr.errorToastr('This table/order is no longer available', 'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        this.router.navigate(['pos']);
      } else {
        this.order = this.table.Orders.find(x => x.CurrentState === 'Ordered'
          || x.CurrentState === 'Served');

        if (this.order === undefined) {
          this.toastr.errorToastr('Order not found', 'Error', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          this.router.navigate(['pos']);
        }

        this.userName = JSON.parse(JSON.stringify(localStorage.getItem('userNameForLogin')));
        this.mergedArrayOfOrderedItems = this.pointOfSaleService.mergeOrderedItems(this.order);
        this.setOrderVat();
        this.setOrderServiceCharge();
        this.setOrderGrossTotalPrice();
        this.setInitialOrderDiscount();
      }
    });
  }


  setInitialOrderDiscount() {
    this.order.DiscountType = '';
    this.order.DiscountRate = 0;
    this.order.DiscountAmount = 0;
  }

  calculateOrderDiscount(form: NgForm) {
    this.setOrderGrossTotalPrice();
    if (form.value.discountType === 'flat') {
      this.order.DiscountType = 'Flat';
      this.order.DiscountRate = form.value.discountRate;
      this.order.DiscountAmount = form.value.discountRate;
    } else {
      this.order.DiscountType = 'Percent';
      this.order.DiscountRate = form.value.discountRate;
      this.order.DiscountAmount =  (this.order.GrossTotalPrice * form.value.discountRate) / 100;
    }
    this.order.GrossTotalPrice -= this.order.DiscountAmount;
  }

  removeOrderDiscount() {
    this.setInitialOrderDiscount();
    this.setOrderGrossTotalPrice();
  }

  setOrderGrossTotalPrice() {
    this.order.GrossTotalPrice = this.order.TotalPrice + this.order.VatAmount
      + this.order.ServiceChargeAmount;
  }


  setOrderServiceCharge() {
    if (this.setting.ServiceChargeRate === 0 || this.setting.ServiceChargeRate === null) {
      this.order.ServiceChargeAmount = 0;
    } else {
      this.order.ServiceChargeAmount = (this.order.TotalPrice * this.setting.ServiceChargeRate) / 100;
    }
  }

  setOrderVat() {
    if (this.setting.VatRate === 0 || this.setting.VatRate === null) {
      this.order.VatAmount = 0;
    } else {
      this.order.VatAmount = (this.order.TotalPrice * this.setting.VatRate) / 100;
    }
  }


  getFoodItemInformation(type: string, foodItemId: number) {
    const foodItem = this.foodItems.find(x => x.Id === foodItemId);
    if (foodItem === undefined || foodItem === null) {
      return '';
    }
    if (type === 'Name and Serial') {
      return foodItem.SerialNumber + '. ' + foodItem.Name;
    }
    if (type === 'Price') {
      return foodItem.Price;
    }
  }


  validateOrder() {

    if (!confirm('Validate this order?')) {
      return;
    }

    this.isDisabled = true;
    this.order.Tendered = this.tendered;
    this.order.Change = this.tendered - this.order.GrossTotalPrice;
    this.order.Change = this.tendered - this.order.GrossTotalPrice;
    this.order.SalesPersonName = this.userName;


    this.orderDataStorageService.validateOrder(this.order).subscribe( (data: any) => {

      if (data === 'Order not found') {
        this.isDisabled = false;
        this.toastr.errorToastr(data, 'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
      }

      this.order.CurrentState = 'Paid';
      this.toastr.successToastr('Order validated', 'Success', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
    });
  }





  printOrderReceipt() {
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
  @page {
      margin: 0.5cm;
  }
  .intro{
  text-align: center;
  }
  .test {
  background-color: red;
  padding-top: 50px;
  padding-bottom: 50px;
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

}


