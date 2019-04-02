import {Component, DoCheck, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FoodItem} from '../../models/food-item.model';
import {Order} from '../../models/order.model';
import {OrderedItem} from '../../models/ordered-item.model';
import {AuthService} from '../../services/auth.service';
import {PointOfSaleService} from '../../services/point-of-sale.service';
import {Inventory} from '../../models/inventory.model';


@Component({
  selector: 'app-point-of-sale',
  templateUrl: './point-of-sale.component.html',
  styleUrls: ['./point-of-sale.component.scss']
})

export class PointOfSaleComponent implements OnInit, DoCheck {
  subscription: Subscription;
  checkOut = false;
  quantity = 0;
  foodItems: FoodItem[] = [];
  order: Order[];
  condition = false;
  uuidCodeOne = '';
  uuidCodeTwo = '';
  uuidCodeThree = '';
  public grandTotal: number;
  public orderedItems: OrderedItem[] = [];
  public orders: Order;
  foodItemCount = 0;
  @ViewChild('serial') serialNo: ElementRef;
  @ViewChild('quantity') quantityOfItem: ElementRef;
  inventories: Inventory[] = [];

  constructor(private pointOfSaleService: PointOfSaleService,
              private router: Router,
              private route: ActivatedRoute,
              private userService : AuthService,
  ) {
  }


  ngOnInit() {
    this.orderedItems = this.pointOfSaleService.getOrderedItemsList();
    if (this.userService.roleMatch(['Admin'])) {
      this.checkOut = true;
    }

    this.route.data.
    subscribe(
      ( data: FoodItem[]) => {
        this.pointOfSaleService.foodItems = data['foodItems'];
      }
    );
    this.foodItems = this.pointOfSaleService.foodItems;

    // this.ourOffersService.foodItemsChanged
    //   .subscribe(
    //     (foodItem: foodItem[]) => {
    //       this.foodItem = foodItem;
    //     }
    //   );
    this.route.data.
    subscribe(
      ( data: Inventory[]) => {
        this.pointOfSaleService.inventories = data['inventories'];
      }
    );
    this.inventories = this.pointOfSaleService.inventories;
    this.subscription = this.pointOfSaleService.inventoriesChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventories = inventories;
        }
      );

  }
  ngDoCheck() {
    this.orderedItems = this.pointOfSaleService.getOrderedItemsList();
    this.grandTotal = this.pointOfSaleService.totalPrice;
  }

  removeFromCart(index: number) {
    this.pointOfSaleService.totalPrice =
      Number.parseInt(this.pointOfSaleService.totalPrice.toString(), 2)
      - Number.parseInt(this.orderedItems[index].TotalPrice.toString(), 2);
    this.orderedItems.splice(index, 1);
    this.pointOfSaleService.orderedItems.splice(index, 1);
  }

  checkFoodItemCount() {
    for ( let i = 0; i < this.orderedItems.length; i++) {
      if (this.orderedItems[i].FoodItemId != null) {
        this.foodItemCount += 1;
      }
    }
    return this.foodItemCount
  }


  AddToOrderedList() {
    this.router.navigate(['payment']);
  }
  add() {
    const serialNumber = this.serialNo.nativeElement.value;
    const quantity = this.quantityOfItem.nativeElement.value;
    if ( serialNumber !== '' && quantity !== '') {
      for (let i = 0; i < this.foodItems.length; i++) {
        if (this.foodItems[i].SerialNumber === serialNumber) {
          this.UpdateCart(
            this.foodItems[i].Id,
            this.foodItems[i].Price,
            this.foodItems[i].Name,
            this.foodItems[i].SerialNumber,
            this.foodItems[i].InventoryCost,
            true,
            quantity
          )
        }
      }
    }
     (<HTMLInputElement>document.getElementById('quantity')).value = '';
     (<HTMLInputElement>document.getElementById('serial')).value = '';

  }
  remove() {
    const serialNumber = this.serialNo.nativeElement.value;
    const quantity = this.quantityOfItem.nativeElement.value;
    if ( serialNumber !== '' && quantity !== '') {
      for (let i = 0; i < this.foodItems.length; i++ ) {
        if (this.foodItems[i].SerialNumber === serialNumber) {
          this.UpdateCart(
            this.foodItems[i].Id,
            this.foodItems[i].Price,
            this.foodItems[i].Name,
            this.foodItems[i].SerialNumber,
            this.foodItems[i].InventoryCost,
            false,
            quantity
          )

        }
      }
    }
    (<HTMLInputElement>document.getElementById('quantity')).value = '';
    (<HTMLInputElement>document.getElementById('serial')).value = '';
  }


  UpdateCart(id: number, price: number, name: string, serialNo: string, makingCost: number,
             isAdd: boolean, quantity: number) {
    if (quantity > 0) {

      const foodItemId = id;
      const foodItemName = name;
      const Price = price;
      const orderId = null;
      if ( this.pointOfSaleService.checkIfOrderedItemExist(id, orderId) === null) {
        const orderItemId = null;
        if ( isAdd === true ) {
          this.AddToCart( orderItemId, orderId,  quantity, foodItemId,
            foodItemName, serialNo, Price, makingCost );
        } else {
          this.RemoveFromCart(orderItemId, orderId,  quantity,
            foodItemId, foodItemName, Price, makingCost );
        }
      } else {
        const orderItemId = this.pointOfSaleService.checkIfOrderedItemExist(id, orderId);
        if ( isAdd === true ) {
          this.AddToCart( orderItemId, orderId,  quantity, foodItemId,
            foodItemName, serialNo, Price, makingCost );
        } else {
          this.RemoveFromCart(orderItemId, orderId,  quantity,
            foodItemId, foodItemName, Price, makingCost );
        }
      }




    }
     }



  AddToCart(orderItemId: number, orderId: number, quantity: number,
            foodItemId: number, foodItemName: string, serialNo: string,
            price: number, makingCost: number ) {


    for (let j = 0; j < this.foodItems.length; j++) {
      if (this.foodItems[j].Id === foodItemId) {
        let check = 0;
        for (let k = 0; k < this.foodItems[j].Ingredients.length; k++ ) {
          const inventoryQuantity =  this.foodItems[j].Ingredients[k].Quantity;
          const totalQuantity = inventoryQuantity * quantity;
          const inventoryId = this.foodItems[j].Ingredients[k].InventoryId;
          for (let l = 0; l < this.inventories.length; l++) {
            if (this.pointOfSaleService.inventories[l].Id === inventoryId) {
              if (this.pointOfSaleService.inventories[l].RemainingQuantity > totalQuantity ) {
                check++;

                if ( check === this.foodItems[j].Ingredients.length) {
                  this.pointOfSaleService.inventories[l].RemainingQuantity -= totalQuantity;
                  const subTotal = this.pointOfSaleService.FoodItemSubTotalPrice(price, quantity);
                  this.pointOfSaleService.grandTotalPrice(subTotal);
                  this.condition = this.pointOfSaleService.checkExistingFoodItem(foodItemId);

                  if ( this.condition  ) {
                    this.pointOfSaleService.increaseOnExistingFoodItem(foodItemId, quantity, subTotal );
                  } else {

                    const purchasedFood = new OrderedItem(orderItemId,  '0',  foodItemId,
                      quantity, price , subTotal);

                    this.pointOfSaleService.addToOrderedItemsList(purchasedFood);
                  }
                  this.pointOfSaleService.totalQuantity
                    = Number.parseInt(this.pointOfSaleService.totalQuantity.toString())
                    + Number.parseInt(quantity.toString());
                }

              }

            }

          }


        }
        if (check < this.foodItems[j].Ingredients.length) {
          alert('Insufficient inventories, please update your inventories first');
        }
        break;
      }
    }



  }

  RemoveFromCart(orderItemId: number, orderId: number, quantity: number,
                 foodItemId: number, foodItemName: string, price: number, makingCost: number) {



    const subTotal = this.pointOfSaleService.FoodItemSubTotalPrice(price, quantity);
    this.pointOfSaleService.removeFromFoodItemCart(foodItemId, quantity, subTotal);

  }

  discardOrder() {
    const dialog = confirm('Delete this order?\n' +
      'You will lose any kind of data associated with the current order!');
    if (dialog === true) {
      this.confirmEvent();
    }
  }
  goToDashboard() {
    if (this.orderedItems.length !== 0) {
      const dialog = confirm('Go Back to Dashboard?\n' +
        'You will lose any kind of data associated with the current order!');
      if (dialog) {
        this.confirmEvent();
        this.router.navigate(['/control-panel']);
      }
    } else {
      this.router.navigate(['/control-panel']);
    }
  }
  confirmEvent() {
    this.pointOfSaleService.clearOrders();
    this.pointOfSaleService.totalPrice = 0;
    this.pointOfSaleService.totalQuantity = 0;
  }
}
