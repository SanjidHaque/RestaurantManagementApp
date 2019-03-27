import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Order} from '../../models/order.model';
import {OurOffersService} from '../../services/our-offers.service';
import {OrderedItem} from '../../models/ordered-item.model';
import {Subscription} from 'rxjs';
import {FoodItem} from '../../models/food-item.model';
import {Inventory} from '../../models/inventory.model';
import {UUID} from 'angular2-uuid';
import {DataStorageService} from '../../services/data-storage.service';

@Component({
  selector: 'app-food-items',
  templateUrl: './food-items.component.html',
  styleUrls: ['./food-items.component.scss']
})

export class FoodItemsComponent implements OnInit {
  index: number;
  total: number;
  FoodItem: FoodItem[] = [];
  inventories: Inventory[] = [];
  selectedQuantity = [];
  order: Order[];
  condition = false;
  @ViewChild('amountInput') amountInputRef: ElementRef;
  uuidCodeOne = '';
  uuidCodeTwo = '';
  uuidCodeThree = '';
  quantity : number;

  imageUrl = 'assets/noImage.png';
  rootUrl = '';

  subscription: Subscription;
  constructor(private ourOffersService: OurOffersService,
              private dataStorageService: DataStorageService) {
    this.uuidCodeOne = UUID.UUID();
    this.uuidCodeTwo = UUID.UUID();
    this.uuidCodeThree = UUID.UUID();
  }

  ngOnInit() {
    this.rootUrl = this.dataStorageService.rootUrl + '/Content/';
    this.FoodItem = this.ourOffersService.foodItems;
    this.ourOffersService.foodItemsChanged
      .subscribe(
        (foodItem: FoodItem[]) => {
          this.FoodItem = foodItem;
        }
      );

    this.inventories = this.ourOffersService.inventories;
    this.subscription = this.ourOffersService.inventoriesChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventories = inventories;
        }
      );
    this.total = this.FoodItem.length;
     for (let i = 0; i < this.FoodItem.length; i++) {
       if (this.FoodItem[i].FoodItemImageName === null || this.FoodItem[i].FoodItemImageName === '' ) {
         this.FoodItem[i].FoodItemImageName = this.imageUrl;
       } else {
         this.FoodItem[i].FoodItemImageName =  this.rootUrl + this.FoodItem[i].FoodItemImageName;
       }
     }
  }





  UpdateCart(id: number, price: number,
             name: string, serialNo: string, makingCost: number, isAdd: boolean, index: any) {

    this.quantity = this.selectedQuantity[index];
    if (this.quantity > 0) {
      const foodItemId = id;
      const foodItemName = name;
      const Price = price;
      const orderId = null;
      if ( this.ourOffersService.checkIfOrderedItemExist(id, orderId) === null) {
        const orderItemId = null;
        if ( isAdd === true ) {
          this.AddToCart( orderItemId, orderId,  this.quantity, foodItemId,
            foodItemName, serialNo, Price, makingCost );
        } else {
          this.RemoveFromCart(orderItemId, orderId,  this.quantity,
            foodItemId, foodItemName, Price, makingCost );
        }
      } else {
        const orderItemId = this.ourOffersService.checkIfOrderedItemExist(id, orderId);
        if ( isAdd === true ) {
          this.AddToCart( orderItemId, orderId,  this.quantity, foodItemId,
            foodItemName, serialNo, Price, makingCost );
        } else {
          this.RemoveFromCart(orderItemId, orderId,  this.quantity,
            foodItemId, foodItemName, Price, makingCost );
        }
      }
    }
  }



  AddToCart(orderItemId: number, orderId: number, quantity: number,
             foodItemId: number, foodItemName: string, serialNo: string, price: number,
             makingCost: number ) {

    for (let j = 0; j < this.FoodItem.length; j++) {
      if (this.FoodItem[j].Id === foodItemId) {
        let check = 0;
        for (let k = 0; k < this.FoodItem[j].Ingredients.length; k++ ) {
          const inventoryQuantity =  this.FoodItem[j].Ingredients[k].Quantity;
          const totalQuantity = inventoryQuantity * quantity;
          const inventoryId = this.FoodItem[j].Ingredients[k].InventoryId;
          for (let l = 0; l < this.inventories.length; l++) {
            if (this.ourOffersService.inventories[l].Id === inventoryId) {
              if (this.ourOffersService.inventories[l].RemainingQuantity > totalQuantity ) {

                check++;

                if ( check === this.FoodItem[j].Ingredients.length) {
                  this.ourOffersService.inventories[l].RemainingQuantity -= totalQuantity;
                  const subTotal = this.ourOffersService.FoodItemSubTotalPrice(price, quantity);
                  this.ourOffersService.grandTotalPrice(subTotal);
                  this.condition = this.ourOffersService.checkExistingFoodItem(foodItemId);

                  if ( this.condition  ) {
                    this.ourOffersService.increaseOnExistingFoodItem(foodItemId, quantity, subTotal );
                  } else {

                    const purchasedFood =
                      new OrderedItem(orderItemId, null,  foodItemId,
                        quantity  , price , subTotal);

                    this.ourOffersService.addToOrderedItemsList(purchasedFood);
                  }
                  this.ourOffersService.totalQuantity
                    = Number.parseInt(this.ourOffersService.totalQuantity.toString())
                    + Number.parseInt(quantity.toString());
                }

              }

            }

          }

        }
        if (check < this.FoodItem[j].Ingredients.length) {
          alert('Insufficient inventories, please update your inventories first');
        }
        break;
      }
    }
  }

  RemoveFromCart(orderItemId: number, orderId: number, quantity: number,
                 foodItemId: number, foodItemName: string, price: number,
                 makingCost: number) {
      const subTotal = this.ourOffersService.FoodItemSubTotalPrice(price, quantity);
      this.ourOffersService.removeFromFoodItemCart(foodItemId, quantity, subTotal);

  }
}
