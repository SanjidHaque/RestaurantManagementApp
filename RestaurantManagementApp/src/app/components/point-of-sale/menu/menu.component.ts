import * as moment from 'moment';
import {NgForm} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {MatBottomSheet} from '@angular/material';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {Table} from '../../../models/table.model';
import {Order} from '../../../models/order.model';
import {Setting} from '../../../models/setting.model';
import {FoodItem} from '../../../models/food-item.model';
import {Inventory} from '../../../models/inventory.model';
import {OrderedItem} from '../../../models/ordered-item.model';
import {OrderSession} from '../../../models/order-session.model';
import {PointOfSaleService} from '../../../services/shared/point-of-sale.service';
import {TableDataStorageService} from '../../../services/data-storage/table-data-storage.service';
import {OrderDataStorageService} from '../../../services/data-storage/order-data-storage.service';
import {OrderCancelOptionComponent} from '../../../bottom-sheets/order-cancel-option/order-cancel-option.component';


@Component({
  selector: 'app-food-items',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {
  table: Table;
  foodItems: FoodItem[] = [];
  inventories: Inventory[] = [];
  setting: Setting;

  order: Order;
  userName: string;

  imageUrl = 'assets/noImage.png';
  rootUrl = '';
  printIndex: number;

  constructor(private pointOfSaleService: PointOfSaleService,
              private orderDataStorageService: OrderDataStorageService,
              private route: ActivatedRoute,
              private bottomSheet: MatBottomSheet,
              private router: Router,
              private toastr: ToastrManager,
              private tableDataStorageService: TableDataStorageService) { }

  ngOnInit() {
    this.route.data.subscribe((data: Data) => {
      this.table = data['table'];
      this.foodItems = data['foodItems'];
      this.inventories = data['inventories'];
      this.setting = data['setting'];
      this.userName = JSON.parse(JSON.stringify(localStorage.getItem('userNameForLogin')));
    });

    this.printIndex = this.pointOfSaleService.i;

    if (this.table === undefined || this.table === null) {
      this.toastr.errorToastr('This table is no longer available', 'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      this.router.navigate(['pos']);
    } else {
      if (this.table.Orders !== null) {
        this.order = this.table.Orders.find(x => x.CurrentState === 'Ordered'
          || x.CurrentState === 'Served');
      }
      this.rootUrl = this.tableDataStorageService.rootUrl + '/Content/FoodItemImages/';
      this.setFoodItemImage();
    }
  }



  setFoodItemImage() {
    for (let i = 0; i < this.foodItems.length; i++) {
      if (this.foodItems[i].FoodItemImageName === null
        || this.foodItems[i].FoodItemImageName === '' ) {
        this.foodItems[i].FoodItemImageName = this.imageUrl;
      } else {
        this.foodItems[i].FoodItemImageName =
          this.rootUrl + this.foodItems[i].FoodItemImageName;
      }
    }
  }


  print(orderSession: OrderSession) {

    const dateTime  = document.createElement('span');
    dateTime.innerHTML = 'Date Time. ' + orderSession.OrderedDateTime;
    document.getElementById('date-time').appendChild(dateTime);

    const tr1  = document.createElement('tr');

    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const td4 = document.createElement('td');

    td1.innerHTML = 'SN and Name';

    td2.innerHTML = '#';
    td2.style.textAlign = 'right';

    td3.innerHTML = 'Price';
    td3.style.textAlign = 'right';

    td4.innerHTML = 'S.Total';
    td4.style.textAlign = 'right';

    tr1.appendChild(td1);
    tr1.appendChild(td2);
    tr1.appendChild(td3);
    tr1.appendChild(td4);

    document.getElementById('ordered-items').appendChild(tr1);

    for (let i = 0; i < orderSession.OrderedItems.length; i++) {
      const tr2  = document.createElement('tr');

      const getNameAndSerial = this.getFoodItemInformation('Name and Serial',
        orderSession.OrderedItems[i].FoodItemId);

      const getPrice = this.getFoodItemInformation('Price',
        orderSession.OrderedItems[i].FoodItemId);

      const td5 = document.createElement('td');
      td5.innerHTML = getNameAndSerial.toString();

      const td6 = document.createElement('td');
      td6.innerHTML = orderSession.OrderedItems[i].FoodItemQuantity.toString();
      td6.style.textAlign = 'right';

      const td7 = document.createElement('td');
      td7.innerHTML = getPrice.toString();
      td7.style.textAlign = 'right';

      const td8 = document.createElement('td');
      td8.innerHTML = orderSession.OrderedItems[i].TotalPrice.toString();
      td8.style.textAlign = 'right';

      tr2.appendChild(td5);
      tr2.appendChild(td6);
      tr2.appendChild(td7);
      tr2.appendChild(td8);

      document.getElementById('ordered-items').appendChild(tr2);
    }

    let printContents, popupWin;
    printContents = document.getElementById('receipt').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();

    const removeDateTime = document.getElementById('date-time');
    while (removeDateTime.firstChild) {
      removeDateTime.removeChild(removeDateTime.firstChild);
    }

    const removeOrderedItems = document.getElementById('ordered-items');
    while (removeOrderedItems.firstChild) {
      removeOrderedItems.removeChild(removeOrderedItems.firstChild);
    }
  }

  updateCart(foodItem: FoodItem, isAddToCart: boolean, form?: NgForm, directQuantity?: number ) {
    let quantity;

    if (directQuantity !== undefined) {
      quantity = directQuantity;
    } else {
      quantity = form.value.indirectQuantity;
    }

    if (!this.pointOfSaleService.checkCartConditions(quantity)) {
      return;
    }

    const foodItemId = foodItem.Id;
    const foodItemName = foodItem.Name;
    const price = foodItem.Price;
    const orderId = null;
    const subTotal = price * quantity;

    if (isAddToCart) {

      if (!this.pointOfSaleService.checkIfInventoryExists(quantity, foodItem, this.foodItems, this.inventories)) {
        return;
      }

      const orderedItem = new OrderedItem(
        null,
        null,
        null,
        foodItem.Id,
        quantity,
        subTotal
      );

      if (!this.pointOfSaleService.deductInventories(foodItem, this.inventories, quantity)) {
        return;
      }

      if (this.order === undefined) {

        const orderedItems: OrderedItem[] = [];
        orderedItems.push(orderedItem);

        const orderSession = new OrderSession(
          null,
          null,
          orderedItems,
          'Not Ordered',
          '',
          ''
        );

        const orderSessions: OrderSession[] = [];
        orderSessions.push(orderSession);

        const order = new Order(
          -1,
          orderSessions,
          0,
          0,
          null,
          null,
          '',
          0,
          0,
          this.table.Id,
          'Not Ordered',
          null,
          null,
          '',
          0,
          0,
          this.userName
        );

        this.order = order;
      } else {
        let orderSession = this.order.OrderSessions.find(x => x.CurrentState === 'Not Ordered');
        if (orderSession === undefined) {

          const orderedItems: OrderedItem[] = [];
          orderedItems.push(orderedItem);

          orderSession = new OrderSession(
            null,
            null,
            orderedItems,
            'Not Ordered',
            '',
            ''
          );

          this.order.OrderSessions.push(orderSession);

        } else {
          const existingOrderedItem = this.pointOfSaleService.checkIfOrderedItemExist(foodItemId, orderSession.OrderedItems);

          if (existingOrderedItem === null) {
              orderSession.OrderedItems.push(orderedItem);

          } else {
              existingOrderedItem.FoodItemQuantity += quantity;
              existingOrderedItem.TotalPrice += subTotal;
          }
        }
      }

      this.order.TotalPrice += subTotal;
      this.order.GrossTotalPrice = this.order.TotalPrice;
      this.order.InventoryCost +=  (foodItem.InventoryCost * quantity);
      this.order.Profit =  this.order.GrossTotalPrice - this.order.InventoryCost;

    } else {
      if (this.order === null || this.order === undefined) {
        return;
      }

      const orderSession = this.order.OrderSessions.find(x => x.CurrentState === 'Not Ordered');
      if (orderSession === null || orderSession === undefined) {
        return;
      }

      const existingOrderedItem = this.pointOfSaleService.checkIfOrderedItemExist(foodItemId, orderSession.OrderedItems);
      if (existingOrderedItem === null || existingOrderedItem === undefined) {
        return;
      }

      if (quantity > existingOrderedItem.FoodItemQuantity)  {
        this.toastr.errorToastr('Value is too big', 'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        return;
      }

      existingOrderedItem.FoodItemQuantity -= quantity;
      existingOrderedItem.TotalPrice -= subTotal;
      this.order.TotalPrice -= subTotal;
      this.order.GrossTotalPrice = this.order.TotalPrice;
      this.order.InventoryCost -=  (foodItem.InventoryCost * quantity);
      this.order.Profit = this.order.TotalPrice - this.order.InventoryCost;


      if (existingOrderedItem.FoodItemQuantity === 0) {
        const index = orderSession.OrderedItems.findIndex(x => x.FoodItemId === existingOrderedItem.FoodItemId);
        orderSession.OrderedItems.splice(index, 1);
      }
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


  updateCartFromSerialNumber(form: NgForm, isAddToCart: boolean) {
    const serialNumber  = form.value.serialNumber;
    const quantity  = form.value.quantity;
    const foodItem = this.foodItems.find(x => x.SerialNumber === serialNumber);

    if (foodItem === undefined) {
      this.toastr.errorToastr('Wrong Serial Number', 'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      return;
    }

    this.updateCart(foodItem, isAddToCart, null , quantity)
  }

  removeFromCart(index: number, orderSession: OrderSession) {
    this.order.TotalPrice -= orderSession.OrderedItems[index].TotalPrice;
    orderSession.OrderedItems.splice(index, 1);

    if (orderSession.OrderedItems.length === 0) {
      const orderSessionIndex = this.order.OrderSessions.findIndex(x => x.Id === orderSession.Id);
      this.order.OrderSessions.splice(orderSessionIndex, 1);
    }
    if (this.order.OrderSessions.length === 0) {
      this.order = undefined;
    }
  }

  placeOrder() {
    const dialog = confirm('Place this order?');
    if (!dialog) {
      return;
    }

    const orderSession = this.order.OrderSessions.find(x => x.CurrentState === 'Not Ordered');
    orderSession.OrderedDateTime = moment().format('h:mm:ss A, Do MMMM YYYY');
    if (this.order.DateTime === '') {
      this.order.DateTime = orderSession.OrderedDateTime;
    }


    this.orderDataStorageService.placeOrder(this.order).subscribe((data: any) => {
      if (data === '') {
        this.toastr.errorToastr('Try again later', 'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        return;
      }

      if (data.Text === 'Insufficient inventories') {
        this.toastr.errorToastr(data.Text, 'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        return;
      }

      if (data.Text === 'Order placed successfully') {
        this.tableDataStorageService.changeTableState(new Table(
          this.order.TableId,
          '',
          'Ordered',
          []
        )).subscribe((response: any) => {
            this.toastr.successToastr(data.Text, 'Success', {
              toastTimeout: 10000,
              newestOnTop: true,
              showCloseButton: true
            });
            this.table.CurrentState = 'Ordered';
            this.order = data.Order;
            return;
          }
        );
      }
    });
  }

  serveOrder(orderSession: OrderSession) {
    const dialog = confirm('Serve this order?');
    if (!dialog) {
      return;
    }

    orderSession.ServedDateTime = moment().format('h:mm:ss A, Do MMMM YYYY');

    this.orderDataStorageService.serveOrder(orderSession).subscribe( (data: any) => {

      orderSession.CurrentState = 'Served';

      let count = 0;
      for (let i = 0; i < this.order.OrderSessions.length; i++) {
        if (this.order.OrderSessions[i].CurrentState === 'Served') {
          count++;
        }
      }

      if (count === this.order.OrderSessions.length) {
        this.order.CurrentState = 'Served';
        this.table.CurrentState = 'Served';
      } else {
        this.order.CurrentState = 'Ordered';
        this.table.CurrentState = 'Ordered';
      }

      if (data === 'Order served successfully') {

        this.tableDataStorageService.changeTableState(new Table(
          this.order.TableId,
          '',
          this.table.CurrentState,
          []
        )).subscribe((response: any) => {

          this.toastr.successToastr(data, 'Success', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          return;
        });

      }

      if (data === 'Order not found') {
        this.toastr.errorToastr(data, 'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
      }
    });
  }

  cancelOrder(orderSession: OrderSession) {
    let action = '';
    this.bottomSheet.open(OrderCancelOptionComponent).afterDismissed().subscribe(
      (data: any) => {
        action = data;

    
    if (action === 'Dismiss') {
      return;
    }

    const dialog = confirm('Are you sure?');
      if (!dialog) {
      return;
    }

    for (let i = 0; this.order.OrderSessions.length; i++) {
      if (this.order.OrderSessions[i].Id === orderSession.Id) {

        this.order.OrderSessions[i].OrderedItems.forEach((value) => {
          this.order.TotalPrice -= value.TotalPrice;
        });

        this.order.OrderSessions.splice(i, 1);
        break;
      }
    }

    const tableId = this.order.TableId;
    if (this.order.OrderSessions.length === 0) {
      this.order = undefined;
      this.table.CurrentState = 'Empty';
    } else {

      const completeOrders = this.order.OrderSessions.filter(
        x => x.CurrentState === 'Ordered'
      );

      if (completeOrders.length > 0) {
        this.order.CurrentState = 'Ordered';
        this.table.CurrentState = 'Ordered';
      } else {
        this.order.CurrentState = 'Served';
        this.table.CurrentState = 'Served';
      }

      const lastIndex = this.order.OrderSessions.length - 1;
      if (this.order.OrderSessions[lastIndex].Id === null && this.order.OrderSessions.length === 1) {

        this.order.Id = -1;
        this.order.CurrentState = 'Not Ordered';
        this.table.CurrentState = 'Empty';
      }
    }
    this.orderDataStorageService.cancelOrder(orderSession).subscribe((response: any) => {
      if (action === 'Revert') {
        this.orderDataStorageService.revertInventory(orderSession).subscribe(
          (result: any) => {
            this.tableDataStorageService.changeTableState(new Table(
              tableId,
              '',
              this.table.CurrentState,
              []
            )).subscribe((roger: any) => {

              this.toastr.successToastr('Order canceled successfully', 'Success', {
                toastTimeout: 10000,
                newestOnTop: true,
                showCloseButton: true
              });

            });
          });
      } else {
        this.tableDataStorageService.changeTableState(new Table(
          tableId,
          '',
          this.table.CurrentState,
          []
        )).subscribe((copy: any) => {

          this.toastr.successToastr('Order canceled successfully', 'Success', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });

        });
      }
    }); });
  }

  getSessionTotalPrice(orderSession: OrderSession) {
    let totalPrice = 0;
    orderSession.OrderedItems.forEach((value) => { totalPrice += value.TotalPrice; });
    return totalPrice;
  }

  clearOrderSession(index: number) {
    const answer = confirm('Clear order list?');
    if (answer) {

      this.order.OrderSessions[index].OrderedItems.forEach((value) => {
        this.order.TotalPrice -= value.TotalPrice;
      });
      this.order.OrderSessions.splice(index, 1);

      if (this.order.OrderSessions.length === 0) {
        this.order = undefined;
      }
    }
  }

}
