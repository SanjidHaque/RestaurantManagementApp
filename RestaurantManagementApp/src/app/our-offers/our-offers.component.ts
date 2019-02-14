import {Component, DoCheck, ElementRef, OnInit, ViewChild} from '@angular/core';
import {OurOffersService} from '../services/our-offers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OrderedItems} from '../models/ordered-items.model';
import {Order} from '../models/order.model';
import {FoodItems} from '../models/food-item.model';
import {Inventory} from '../models/inventory.model';
import {UserService} from '../services/user.service';
import {UUID} from 'angular2-uuid';


@Component({
  selector: 'app-our-offers',
  templateUrl: './our-offers.component.html',
  styleUrls: ['./our-offers.component.scss']
})
export class OurOffersComponent implements OnInit, DoCheck {
  subscription: Subscription;
  checkOut = false;
  quantity = 0;
  FoodItem: FoodItems[] = [];
  order: Order[];
  condition = false;
  uuidCodeOne = '';
  uuidCodeTwo = '';
  uuidCodeThree = '';
  public grandTotal: number;
  public orderedItems: OrderedItems[];
  public orders: Order;
  foodItemCount = 0;
  @ViewChild('serial') serialNo: ElementRef;
  @ViewChild('quantity') quantityOfItem: ElementRef;
  inventories: Inventory[] = [];

  constructor(private _ourOfferService: OurOffersService,
              private router: Router,
              private route: ActivatedRoute,
              private userService : UserService,
  ) {
    this.uuidCodeOne = UUID.UUID();
    this.uuidCodeTwo = UUID.UUID();
    this.uuidCodeThree = UUID.UUID();
    this.uuidCodeOne = UUID.UUID();
  }


  ngOnInit() {
    this.orderedItems = this._ourOfferService.getOrderedItemsList();
    if (this.userService.roleMatch(['Admin'])) {
      this.checkOut = true;
    }

    this.route.data.
    subscribe(
      ( data: FoodItems[]) => {
        this._ourOfferService.FoodItem = data['foodItems'];
      }
    );
    this.FoodItem = this._ourOfferService.FoodItem;

    this._ourOfferService.foodItemChanged
      .subscribe(
        (FoodItem: FoodItems[]) => {
          this.FoodItem = FoodItem;
        }
      );
    this.route.data.
    subscribe(
      ( data: Inventory[]) => {
        this._ourOfferService.inventory = data['inventories'];
      }
    );
    this.inventories = this._ourOfferService.inventory;
    this.subscription = this._ourOfferService.inventoryChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventories = inventories;
        }
      );

  }
  ngDoCheck() {
    this.orderedItems = this._ourOfferService.getOrderedItemsList();
    this.grandTotal = this._ourOfferService.TotalPrice;
  }

  removeFromCart(index: number) {
    this._ourOfferService.TotalPrice = Number.parseInt(this._ourOfferService.TotalPrice.toString())
      - Number.parseInt(this.orderedItems[index].FoodItemSubTotal.toString());
    this.orderedItems.splice(index, 1);
    this._ourOfferService.orderedItems.splice(index, 1);
  }
  checkFoodItemCount() {
    for ( let i = 0; i< this.orderedItems.length; i++) {
      if(this.orderedItems[i].FoodItemName != null) {
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
      for (let i = 0; i < this.FoodItem.length; i++) {
        if (this.FoodItem[i].SerialNo === serialNumber) {
          this.UpdateCart(
            this.FoodItem[i].Id,
            this.FoodItem[i].Price,
            this.FoodItem[i].Name,
            this.FoodItem[i].SerialNo,
            this.FoodItem[i].MakingCost,
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
      for ( let i = 0; i < this.FoodItem.length; i++ ) {
        if (this.FoodItem[i].SerialNo === serialNumber) {
          this.UpdateCart(
            this.FoodItem[i].Id,
            this.FoodItem[i].Price,
            this.FoodItem[i].Name,
            this.FoodItem[i].SerialNo,
            this.FoodItem[i].MakingCost,
            false,
            quantity
          )

        }
      }
    }
    (<HTMLInputElement>document.getElementById('quantity')).value = '';
    (<HTMLInputElement>document.getElementById('serial')).value = '';
  }


  UpdateCart(id: string, price: number, name: string, serialNo: string, makingCost: number,
             isAdd: boolean, quantity: number) {
    if (quantity > 0) {

      const foodItemId = id;
      const foodItemName = name;
      const Price = price;
      const orderId = null;
      if ( this._ourOfferService.checkIfOrderedItemExist(id, orderId) === null) {
        const orderItemId = UUID.UUID();
        if ( isAdd === true ) {
          this.AddToCart( orderItemId, orderId,  quantity, foodItemId,
            foodItemName, serialNo, Price, makingCost );
        } else {
          this.RemoveFromCart(orderItemId, orderId,  quantity,
            foodItemId, foodItemName, Price, makingCost );
        }
      } else {
        const orderItemId = this._ourOfferService.checkIfOrderedItemExist(id, orderId);
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



  AddToCart(orderItemId: string, orderId: string, quantity: number,
            foodItemId: string, foodItemName: string, serialNo: string, price: number, makingCost: number ) {


    for (let j = 0; j < this.FoodItem.length; j++) {
      if (this.FoodItem[j].Id === foodItemId) {
        let check = 0;
        for (let k = 0; k < this.FoodItem[j].Ingredients.length; k++ ) {
          const inventoryQuantity =  this.FoodItem[j].Ingredients[k].Quantity;
          const totalQuantity = inventoryQuantity * quantity;
          const inventoryId = this.FoodItem[j].Ingredients[k].InventoryId;
          for (let l = 0; l < this.inventories.length; l++) {
            if (this._ourOfferService.inventory[l].Id === inventoryId) {
              if (this._ourOfferService.inventory[l].RemainingQuantity > totalQuantity ) {
                check++;

                if ( check === this.FoodItem[j].Ingredients.length) {
                  this._ourOfferService.inventory[l].RemainingQuantity -= totalQuantity;
                  const subTotal = this._ourOfferService.FoodItemSubTotalPrice(price, quantity);
                  this._ourOfferService.grandTotalPrice(subTotal);
                  this.condition = this._ourOfferService.checkExistingFoodItem(foodItemId);

                  if ( this.condition  ) {
                    this._ourOfferService.increaseOnExistingFoodItem(foodItemId, quantity, subTotal );
                  } else {

                    const purchasedFood = new OrderedItems(orderItemId, orderId,  foodItemId,
                      quantity, foodItemName, serialNo, price , subTotal, makingCost);

                    this._ourOfferService.addToOrderedItemsList(purchasedFood);
                  }
                  this._ourOfferService.totalQuantity
                    = Number.parseInt(this._ourOfferService.totalQuantity.toString())
                    + Number.parseInt(quantity.toString());
                }

              }

            }

          }


        }
        if (check < this.FoodItem[j].Ingredients.length) {
          alert('Insufficient inventory, please update your inventory first');
        }
        break;
      }
    }



  }

  RemoveFromCart(orderItemId: string, orderId: string, quantity: number,
                 foodItemId: string, foodItemName: string, price: number, makingCost: number) {



    const subTotal = this._ourOfferService.FoodItemSubTotalPrice(price, quantity);
    this._ourOfferService.removeFromFoodItemCart(foodItemId, quantity, subTotal);

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
    this._ourOfferService.clearOrders();
    this._ourOfferService.TotalPrice = 0;
    this._ourOfferService.totalQuantity = 0;
  }
}
