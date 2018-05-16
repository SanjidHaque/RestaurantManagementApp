import {Component, DoCheck, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Order} from '../../shared/order.model';
import {OurOffersService} from '../our-offers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderedItems} from '../../shared/ordered-items.model';
import { Uuid } from 'ng2-uuid';
import {Subscription} from 'rxjs/Subscription';
import {DataStorageService} from '../../shared/data-storage.service';
import {FoodItems} from '../../shared/food-item.model';
import {Inventory} from '../../shared/inventory.model';

@Component({
  selector: 'app-food-items',
  templateUrl: './food-items.component.html',
  styleUrls: ['./food-items.component.scss']
})
export class FoodItemsComponent implements OnInit {
  index: number;
  total: number;
  FoodItem: FoodItems[] = [];
  inventories: Inventory[] = [];
  selectedQuantity = [];
  order: Order[];
  condition = false;
  @ViewChild('amountInput') amountInputRef: ElementRef;
  uuidCodeOne = '';
  uuidCodeTwo = '';
  uuidCodeThree = '';
  quantity : number;
  imageUrl = '/assets/noImage.png';

  subscription: Subscription;
  constructor(private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private router: Router,
              private route: ActivatedRoute,
              private uuid: Uuid
  ) {
    this.uuidCodeOne = this.uuid.v1();
    this.uuidCodeTwo = this.uuid.v1();
    this.uuidCodeThree = this.uuid.v1();
  }

  ngOnInit() {
    this.FoodItem = this._ourOfferService.FoodItem;
    this._ourOfferService.foodItemChanged
      .subscribe(
        (FoodItem: FoodItems[]) => {
          this.FoodItem = FoodItem;
        }
      );

    this.inventories = this._ourOfferService.inventory;
    this.subscription = this._ourOfferService.inventoryChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventories = inventories;
        }
      );
    this.total = this.FoodItem.length;
    for (let i = 0; i < this.FoodItem.length; i++) {
      if (this.FoodItem[i].FoodItemImage === null || this.FoodItem[i].FoodItemImage === '' ) {
        this.FoodItem[i].FoodItemImage = this.imageUrl;
      }
    }
  }





  UpdateCart(id: string, price: number, name: string, serialNo: string, makingCost: number, isAdd: boolean, index: any) {
    this.quantity = this.selectedQuantity[index];
    let foodItemId = id;
    let foodItemName = name;
    let Price = price;
    let orderId = null;
    if ( this._ourOfferService.checkIfOrderedItemExist(id, orderId) === null) {
     let orderItemId = this.uuid.v1();
      if ( isAdd === true ) {
        this.AddToCart( orderItemId, orderId,  this.quantity, foodItemId,
          foodItemName, serialNo, Price, makingCost );
      } else {
        this.RemoveFromCart(orderItemId, orderId,  this.quantity,
          foodItemId, foodItemName, Price, makingCost );
      }
    }
    else {
      let orderItemId = this._ourOfferService.checkIfOrderedItemExist(id, orderId);
      if ( isAdd === true ) {
        this.AddToCart( orderItemId, orderId,  this.quantity, foodItemId,
          foodItemName, serialNo, Price, makingCost );
      } else {
        this.RemoveFromCart(orderItemId, orderId,  this.quantity,
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
                        quantity , foodItemName, serialNo, price , subTotal, makingCost);

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
                 foodItemId: string, foodItemName: string, price: number,
                 makingCost: number) {


      let subTotal = this._ourOfferService.FoodItemSubTotalPrice(price, quantity);
      this._ourOfferService.removeFromFoodItemCart(foodItemId, quantity, subTotal);

  }
}
