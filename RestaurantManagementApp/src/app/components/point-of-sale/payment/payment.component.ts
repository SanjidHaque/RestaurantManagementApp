import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OrderedItem} from '../../../models/ordered-item.model';
import {Order} from '../../../models/order.model';
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
  percent = 'percent';

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
              private tableDataStorageService: TableDataStorageService,
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
      this.order.DiscountAmount = (this.order.GrossTotalPrice * form.value.discountRate) / 100;
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
    if (type === 'Name') {
      return foodItem.Name;
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


    this.orderDataStorageService.validateOrder(this.order).subscribe((data: any) => {

      if (data === 'Order not found') {
        this.isDisabled = false;
        this.toastr.errorToastr(data, 'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        return;
      }
      this.tableDataStorageService.changeTableState(new Table(
        this.order.TableId,
        '',
        'Empty',
        []
      )).subscribe((response: any) => {
        this.order.CurrentState = 'Paid';
        this.toastr.successToastr('Order validated', 'Success', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
      });
    });
  }


  getTableName(tableId: number) {
    const table = this.tables.find(x => x.Id === tableId);
    if (table === undefined) {
      return '';
    }
    return table.Name;
  }

}


