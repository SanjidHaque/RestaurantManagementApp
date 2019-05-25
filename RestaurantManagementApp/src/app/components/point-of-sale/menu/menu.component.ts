import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {UUID} from 'angular2-uuid';
import {FoodItem} from '../../../models/food-item.model';
import {Inventory} from '../../../models/inventory.model';
import {Order} from '../../../models/order.model';
import {TableDataStorageService} from '../../../services/data-storage/table-data-storage.service';
import {PointOfSaleService} from '../../../services/shared/point-of-sale.service';
import {OrderedItem} from '../../../models/ordered-item.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ActivateRoutes} from '@angular/router/src/operators/activate_routes';
import {NgForm} from '@angular/forms';
import {ToastrManager} from 'ng6-toastr-notifications';
import {Table} from '../../../models/table.model';
import {OrderSession} from '../../../models/order-session.model';

@Component({
  selector: 'app-food-items',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  tableId: number;
  table: Table;
  tables: Table[] = [];

  foodItems: FoodItem[] = [];
  inventories: Inventory[] = [];

  order: Order;
  orderSessions: OrderSession[] = [];
  orderedItems: OrderedItem[] = [];


  imageUrl = 'assets/noImage.png';
  rootUrl = '';

  constructor(private pointOfSaleService: PointOfSaleService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrManager,
              private dataStorageService: TableDataStorageService) {
    this.route.params.subscribe((params: Params) => this.tableId = +params['table-id']);
  }


  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.foodItems = data['foodItems'];
      this.tables = data['tables'];
      this.inventories = data['inventories'];
    });

    this.table = this.tables.find(x => x.Id === this.tableId);

    if (this.table === undefined) {
      this.toastr.errorToastr('This table is no longer available', 'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      this.router.navigate(['pos']);
    } else {

      this.order = this.table.Orders.find(x => x.CurrentState === ('Ordered' || 'Served'));

      this.rootUrl = this.dataStorageService.rootUrl + '/Content/FoodItemImages/';
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



  updateCart(form, foodItem: FoodItem, isAdd: boolean) {
    const quantity = form.value.indirectQuantity;

    if (quantity % 1 !== 0) {
       this.toastr.errorToastr('Value cannot be fractional', 'Error', {
         toastTimeout: 10000,
         newestOnTop: true,
         showCloseButton: true
       });
       return;
    }

    if (quantity <= 0) {
      this.toastr.errorToastr('Value cannot be negative or zero', 'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      return;
    }


    if (isAdd) {
      this.checkIfInventoryExists(quantity, foodItem);

      const foodItemId = foodItem.Id;
      const foodItemName = foodItem.Name;
      const price = foodItem.Price;
      const orderId = null;
      const subTotal = this.pointOfSaleService.FoodItemSubTotalPrice(price, quantity);
      const orderedItem = new OrderedItem(
        null,
        null,
        null,
        foodItem.Id,
        quantity,
        subTotal
      );

      if (!isAdd) {

      }

      if (this.order === undefined) {

        const orderedItems: OrderedItem[] = [];
        orderedItems.push(orderedItem);

        const orderSession = new OrderSession(
          null,
          null,
          orderedItems,
          'Not Ordered'
        );

        const orderSessions: OrderSession[] = [];
        orderSessions.push(orderSession);

        const order = new Order(
          null,
          orderSessions,
          0,
          null,
          null,
          new Date().toLocaleString(),
          0,
          0,
          this.tableId,
          'Not Ordered'
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
            'Not Ordered'
          );

          this.order.OrderSessions.push(orderSession);


        } else {

          const existingOrderedItem = this.pointOfSaleService.checkIfOrderedItemExist(foodItemId, orderSession.OrderedItems);

          if (existingOrderedItem === null) {
            if (isAdd) {
              orderSession.OrderedItems.push(orderedItem);
            } else {
              return;
            }

          } else {


              existingOrderedItem.FoodItemQuantity += quantity;
              existingOrderedItem.TotalPrice += subTotal;



             // existingOrderedItem.FoodItemQuantity -= quantity;
            //  existingOrderedItem.TotalPrice -= subTotal;


          }

        }

      }


      console.log(this.order);
    } else {

    }


    

    }


  placeOrder() {

  }

  serveOrder() {

  }


  checkIfInventoryExists(quantity: number, foodItem: FoodItem) {
    for (let j = 0; j < this.foodItems.length; j++) {

      if (this.foodItems[j].Id === foodItem.Id) {
        let check = 0;
        for (let k = 0; k < this.foodItems[j].Ingredients.length; k++ ) {

          const inventoryQuantity =  this.foodItems[j].Ingredients[k].Quantity;
          const totalQuantity = inventoryQuantity * quantity;
          const inventoryId = this.foodItems[j].Ingredients[k].InventoryId;

          for (let l = 0; l < this.inventories.length; l++) {

            if (this.pointOfSaleService.inventories[l].Id === inventoryId) {

              if (this.inventories[l].RemainingQuantity > totalQuantity ) {

                check++;

              }
            }
          }
        }
        if (check < this.foodItems[j].Ingredients.length) {
          this.toastr.errorToastr('Insufficient inventories', 'Error', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
        }
        break;
      }
    }
  }


  addToCart(quantity: number, foodItem: FoodItem) {

    for (let j = 0; j < this.foodItems.length; j++) {
      if (this.foodItems[j].Id === foodItem.Id) {

        for (let k = 0; k < this.foodItems[j].Ingredients.length; k++ ) {

          const inventoryQuantity =  this.foodItems[j].Ingredients[k].Quantity;
          const totalQuantity = inventoryQuantity * quantity;
          const inventoryId = this.foodItems[j].Ingredients[k].InventoryId;

          for (let l = 0; l < this.inventories.length; l++) {

            if (this.pointOfSaleService.inventories[l].Id === inventoryId) {

                 //  const subTotal = foodItem.Price * quantity;
                 //
                 // this.pointOfSaleService.checkIfOrderedItemExist(foodItem.Id, );
                 //
                 //  if (condition) {
                 //
                 //  } else {
                 //
                 //  }

            }
          }
        }

      }
    }
  }

  removeFromCart(quantity: number, foodItem: FoodItem) {
      const subTotal = this.pointOfSaleService.FoodItemSubTotalPrice(foodItem.Price, quantity);
      this.pointOfSaleService.removeFromFoodItemCart(foodItem.Id, quantity, subTotal);
  }
}
