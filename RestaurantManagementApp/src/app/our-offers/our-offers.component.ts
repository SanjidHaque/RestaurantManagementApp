import {Component, DoCheck, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {OurOffersService} from './our-offers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {DataStorageService} from '../shared/data-storage.service';
import {OrderedItems} from '../shared/ordered-items.model';
import {Order} from '../shared/order.model';
import { Uuid } from 'ng2-uuid';
import {Popup} from 'ng2-opd-popup';
import {FoodItems} from '../shared/food-item.model';
import {Inventory} from '../shared/inventory.model';
import {UserService} from '../user.service';


@Component({
  selector: 'app-our-offers',
  templateUrl: './our-offers.component.html',
  styleUrls: ['./our-offers.component.scss']
})
export class OurOffersComponent implements OnInit, DoCheck {
  subscription: Subscription;
  checkOut = false;
  quantity = 0;
  onCheck = 0;
  FoodItem: FoodItems[] = [];
  order: Order[];
  condition = false;
  uuidCodeOne = '';
  uuidCodeTwo = '';
  uuidCodeThree = '';
  public grandTotal: number;
  public orderedItems: OrderedItems[];
  public orders: Order;
  checkOrder = false;
  foodItemCount = 0;
  setMenuCount =  0;
  @ViewChild('serial') serialNo: ElementRef;
  @ViewChild('quantity') quantityOfItem: ElementRef;
  inventories: Inventory[] = [];

  constructor(private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private router: Router,
              private route: ActivatedRoute,
              private uuid: Uuid,
              private popup: Popup,
              private userService : UserService,
  ) {
    this.uuidCodeOne = this.uuid.v1();
    this.uuidCodeTwo = this.uuid.v1();
    this.uuidCodeThree = this.uuid.v1();
    this.uuidCodeOne = this.uuid.v1();
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

    let foodItemId = id;
    let foodItemName = name;
    let Price = price;
    let orderId = null;
    if ( this._ourOfferService.checkIfOrderedItemExist(id, orderId) === null) {
      let orderItemId = this.uuid.v1();
      if ( isAdd === true ) {
        this.AddToCart( orderItemId, orderId,  quantity, foodItemId,
          foodItemName, serialNo, Price, makingCost );
      } else {
        this.RemoveFromCart(orderItemId, orderId,  quantity,
          foodItemId, foodItemName, Price, makingCost );
      }
    }
    else {
      let orderItemId = this._ourOfferService.checkIfOrderedItemExist(id, orderId);
      if ( isAdd === true ) {
        this.AddToCart( orderItemId, orderId,  quantity, foodItemId,
          foodItemName, serialNo, Price, makingCost );
      } else {
        this.RemoveFromCart(orderItemId, orderId,  quantity,
          foodItemId, foodItemName, Price, makingCost );
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



    let subTotal = this._ourOfferService.FoodItemSubTotalPrice(price, quantity);
    this._ourOfferService.removeFromFoodItemCart(foodItemId, quantity, subTotal);

  }

  DiscardOrder() {
    this.popup.options = {
      header: 'Destroy Current Order?',
      color: '#760000', // red, blue....
      widthProsentage: 40, // The with of the popou measured by browser width
      animationDuration: 1, // in seconds, 0 = no animation
      showButtons: true, // You can hide this in case you want to use custom buttons
      confirmBtnContent: 'Confirm', // The text on your confirm button
      cancleBtnContent: 'Cancel', // the text on your cancel button
      confirmBtnClass: 'btn btn-default', // your class for styling the confirm button
      cancleBtnClass: 'btn btn-default', // you class for styling the cancel button
      animation: 'bounceIn' // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown'
    };
    this.popup.show();
  }
  clear() {
    this.ConfirmEvent();
  }
  ConfirmEvent() {
    this._ourOfferService.clearOrders();
    this._ourOfferService.TotalPrice = 0;
    this._ourOfferService.totalQuantity = 0;
    this.popup.hide();
  }

  CancelEvent() {
    this.popup.hide();
  }
}
