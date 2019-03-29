import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {UUID} from 'angular2-uuid';
import {FoodItem} from '../../../models/food-item.model';
import {Inventory} from '../../../models/inventory.model';
import {Order} from '../../../models/order.model';
import {DataStorageService} from '../../../services/data-storage.service';
import {PointOfSaleService} from '../../../services/point-of-sale.service';
import {OrderedItem} from '../../../models/ordered-item.model';

@Component({
  selector: 'app-food-items',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {
  index: number;
  total: number;
  foodItems: FoodItem[] = [];
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
  constructor(private pointOfSaleService: PointOfSaleService,
              private dataStorageService: DataStorageService) {
    this.uuidCodeOne = UUID.UUID();
    this.uuidCodeTwo = UUID.UUID();
    this.uuidCodeThree = UUID.UUID();
  }

  ngOnInit() {
    this.rootUrl = this.dataStorageService.rootUrl + '/Content/';
    this.foodItems = this.pointOfSaleService.foodItems;
    this.pointOfSaleService.foodItemsChanged
      .subscribe(
        (foodItem: FoodItem[]) => {
          this.foodItems = foodItem;
        }
      );

    this.inventories = this.pointOfSaleService.inventories;
    this.subscription = this.pointOfSaleService.inventoriesChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventories = inventories;
        }
      );
    this.total = this.foodItems.length;
     for (let i = 0; i < this.foodItems.length; i++) {
       if (this.foodItems[i].FoodItemImageName === null || this.foodItems[i].FoodItemImageName === '' ) {
         this.foodItems[i].FoodItemImageName = this.imageUrl;
       } else {
         this.foodItems[i].FoodItemImageName =  this.rootUrl + this.foodItems[i].FoodItemImageName;
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
      if ( this.pointOfSaleService.checkIfOrderedItemExist(id, orderId) === null) {
        const orderItemId = null;
        if ( isAdd === true ) {
          this.AddToCart( orderItemId, orderId,  this.quantity, foodItemId,
            foodItemName, serialNo, Price, makingCost );
        } else {
          this.RemoveFromCart(orderItemId, orderId,  this.quantity,
            foodItemId, foodItemName, Price, makingCost );
        }
      } else {
        const orderItemId = this.pointOfSaleService.checkIfOrderedItemExist(id, orderId);
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

                    const purchasedFood =
                      new OrderedItem(orderItemId, null,  foodItemId,
                        quantity  , price , subTotal);

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
                 foodItemId: number, foodItemName: string, price: number,
                 makingCost: number) {
      const subTotal = this.pointOfSaleService.FoodItemSubTotalPrice(price, quantity);
      this.pointOfSaleService.removeFromFoodItemCart(foodItemId, quantity, subTotal);

  }
}
