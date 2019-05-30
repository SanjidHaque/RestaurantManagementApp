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
    this.order.GrossTotalPrice = this.order.TotalPrice + this.order.Vat + this.order.ServiceCharge;
  }


  setOrderServiceCharge() {
    if (this.setting.ServiceCharge === 0 || this.setting.ServiceCharge === null) {
      this.order.ServiceCharge = 0;
    } else {
      this.order.ServiceCharge = (this.order.TotalPrice * this.setting.ServiceCharge) / 100;
    }
  }

  setOrderVat() {
    if (this.setting.VatAmount === 0 || this.setting.VatAmount === null) {
      this.order.Vat = 0;
    } else {
      this.order.Vat = (this.order.TotalPrice * this.setting.VatAmount) / 100;
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






    // discardOrder() {
    // const dialog = confirm('Delete this order?\n' +
    //   'You will lose any kind of data associated with the current order!');
    //   if (dialog === true) {
    //     this.confirmEvent();
    //     }
    // }
    //
    // confirmEvent() {
    //   this.pointOfSaleService.clearOrders();
    //   this.pointOfSaleService.totalPrice = 0;
    //   this.pointOfSaleService.totalQuantity = 0;
    //   this.router.navigate(['our-offers/regulars']);
    // }
    //
    // back() {
    //     this.router.navigate(['our-offers']);
    // }
    //
    // checkCertainAmount() {
    //   if (this.tendered < this.grandTotal || this.grandTotal === 0 ) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // }
    // selectChangeHandler (event: any) {
    //   this.selectedTable = event.target.value;
    // }
    // checkCertainChange() {
    //   if (this.tendered < this.grandTotal || this.tendered === 0 ) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // }
    //
    //
    //
    // validate() {
    //   const orderId = null;
    //   this.onCheck  = 1;
    //
    //   this.orderedItems = this.pointOfSaleService.orderedItems;
    //   for ( let i = 0; i < this.pointOfSaleService.orderedItems.length; i++) {
    //     this.pointOfSaleService.orderedItems[i].OrderId = orderId;
    //
    //   }
    //
    //   const totalPrice = this.pointOfSaleService.totalPrice;
    //   if ( this.selectedTable === '' || this.selectedTable === 'Select a Table' ) {
    //     this.table  =  'No Table';
    //   } else {
    //     this.table = this.selectedTable;
    //   }
    //   for (let i = 0; i < this.orderedItems.length; i++) {
    //       this.inventoryCost = Number.parseInt(this.inventoryCost.toString()) +
    //         (Number.parseInt(this.orderedItems[i].FoodItemQuantity.toString()) *
    //           Number.parseInt(this.orderedItems[i].TotalPrice.toString()));
    //   }
    //
    //   this.orderProfit = totalPrice - this.inventoryCost;
    //   this.change = Number.parseInt(this.tendered.toString())
    //     - Number.parseInt(totalPrice.toString());
    //   const dateTime = new Date().toLocaleString();
    //
    //   // this.order = new Order(orderId, this.pointOfSaleService.orderedItems, totalPrice,
    //   //   this.tendered, this.change, dateTime , this.table,
    //   //   this.inventoryCost, this.orderProfit );
    //   // this.pointOfSaleService.addToOrderedList(this.order);
    //
    // //  this._dataStorageService.addNewOrder(this.order).subscribe();
    //   this.router.navigate(['receipt']);
    // }


}
