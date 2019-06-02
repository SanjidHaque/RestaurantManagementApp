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
        console.log(this.order);

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
    this.order.GrossTotalPrice = Math.ceil(this.order.GrossTotalPrice);
  }

  removeOrderDiscount() {
    this.setInitialOrderDiscount();
    this.setOrderGrossTotalPrice();
  }

  setOrderGrossTotalPrice() {
    this.order.GrossTotalPrice = this.order.TotalPrice + this.order.VatAmount
      + this.order.ServiceChargeAmount;

    this.order.GrossTotalPrice = Math.ceil(this.order.GrossTotalPrice);
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
    this.order.Profit = this.order.GrossTotalPrice - this.order.InventoryCost;
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
        @media print {
        #invoice-POS{
  box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
  padding:2mm;
  margin: 0 auto;
  width: 44mm;
  background: #FFF;


  ::selection {background: #f31544; color: #FFF;}
  h1{
    font-size: 1.5em;
    color: #222;
  }
  h2{font-size: .9em;}
  h3{
    font-size: 1.2em;
    font-weight: 300;
    line-height: 2em;
  }
  p{
    font-size: .7em;
    color: #666;
    line-height: 1.2em;
  }

  #top, #mid,#bot{ /* Targets all id with 'col-' */
    border-bottom: 1px solid #EEE;
  }

  #top{min-height: 100px;}
  #mid{min-height: 80px;}
  #bot{ min-height: 50px;}

  #top .logo{
    //float: left;
    height: 60px;
    width: 60px;
    background: url(http://michaeltruong.ca/images/logo1.png) no-repeat;
    background-size: 60px 60px;
  }
  .clientlogo{
    float: left;
    height: 60px;
    width: 60px;
    background: url(http://michaeltruong.ca/images/client.jpg) no-repeat;
    background-size: 60px 60px;
    border-radius: 50px;
  }
  .info{
    display: block;
    //float:left;
    margin-left: 0;
  }
  .title{
    float: right;
  }
  .title p{text-align: right;}
  table{
    width: 100%;
    border-collapse: collapse;
  }
  td{
    //padding: 5px 0 5px 15px;
    //border: 1px solid #EEE
  }
  .tabletitle{
    //padding: 5px;
    font-size: .5em;
    background: #EEE;
  }
  .service{border-bottom: 1px solid #EEE;}
  .item{width: 24mm;}
  .itemtext{font-size: .5em;}

  #legalcopy{
    margin-top: 5mm;
  } }
 } </style>
        </head>
     <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}


