import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Order} from '../../models/order.model';
import {OurOffersService} from '../../services/our-offers.service';
import {OrderedItems} from '../../models/ordered-items.model';
import {Subscription} from 'rxjs';
import {FoodItems} from '../../models/food-item.model';
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

  imageUrl = 'assets/images/noImage.png';
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
    this.FoodItem = this.ourOffersService.FoodItem;
    this.ourOffersService.foodItemChanged
      .subscribe(
        (FoodItem: FoodItems[]) => {
          this.FoodItem = FoodItem;
        }
      );

    this.inventories = this.ourOffersService.inventory;
    this.subscription = this.ourOffersService.inventoryChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventories = inventories;
        }
      );
    this.total = this.FoodItem.length;
     for (let i = 0; i < this.FoodItem.length; i++) {
       if (this.FoodItem[i].FoodItemImage === null || this.FoodItem[i].FoodItemImage === '' ) {
         this.FoodItem[i].FoodItemImage = this.imageUrl;
       } else {
         this.FoodItem[i].FoodItemImage =  this.rootUrl + this.FoodItem[i].FoodItemImage;
       }
     }
  }





  UpdateCart(id: string, price: number, name: string, serialNo: string, makingCost: number, isAdd: boolean, index: any) {

    this.quantity = this.selectedQuantity[index];
    if (this.quantity > 0) {
      const foodItemId = id;
      const foodItemName = name;
      const Price = price;
      const orderId = null;
      if ( this.ourOffersService.checkIfOrderedItemExist(id, orderId) === null) {
        const orderItemId = UUID.UUID();
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
              if (this.ourOffersService.inventory[l].Id === inventoryId) {
                if (this.ourOffersService.inventory[l].RemainingQuantity > totalQuantity ) {

                    check++;

                  if ( check === this.FoodItem[j].Ingredients.length) {
                    this.ourOffersService.inventory[l].RemainingQuantity -= totalQuantity;
                    const subTotal = this.ourOffersService.FoodItemSubTotalPrice(price, quantity);
                    this.ourOffersService.grandTotalPrice(subTotal);
                    this.condition = this.ourOffersService.checkExistingFoodItem(foodItemId);

                    if ( this.condition  ) {
                      this.ourOffersService.increaseOnExistingFoodItem(foodItemId, quantity, subTotal );
                    } else {

                      const purchasedFood = new OrderedItems(orderItemId, orderId,  foodItemId,
                        quantity , foodItemName, serialNo, price , subTotal, makingCost);

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
            alert('Insufficient inventory, please update your inventory first');
          }
break;
      }
    }
  }

  RemoveFromCart(orderItemId: string, orderId: string, quantity: number,
                 foodItemId: string, foodItemName: string, price: number,
                 makingCost: number) {
      const subTotal = this.ourOffersService.FoodItemSubTotalPrice(price, quantity);
      this.ourOffersService.removeFromFoodItemCart(foodItemId, quantity, subTotal);

  }
}
