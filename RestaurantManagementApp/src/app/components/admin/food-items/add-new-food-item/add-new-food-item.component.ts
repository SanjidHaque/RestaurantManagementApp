import {NgForm} from '@angular/forms';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


import {ToastrManager} from 'ng6-toastr-notifications';
import {FoodItem} from '../../../../models/food-item.model';
import {Inventory} from '../../../../models/inventory.model';
import {Ingredient} from '../../../../models/ingredient.model';
import {FoodItemDataStorageService} from '../../../../services/food-item-data-storage.service';

@Component({
  selector: 'app-add-new-food-item',
  templateUrl: './add-new-food-item.component.html',
  styleUrls: ['./add-new-food-item.component.scss']
})

export class AddNewFoodItemComponent implements OnInit {
  isDisabled = false;

  inventories: Inventory[] = [];
  ingredients: Ingredient[] = [];
  foodItems: FoodItem[] = [];

  sellingPrice = 0;
  inventoryCost = 0;
  isAddToIngredientList: boolean;


  fileToUpload: File = null;
  imageUrl = 'assets/noImage.png';
  @ViewChild('Image') Image: any;

  constructor(private route: ActivatedRoute,
              private toastr: ToastrManager,
              private router: Router,
              private foodItemDataStorageService: FoodItemDataStorageService,
           ) {}

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: Inventory[]) => {
        this.foodItems = data['foodItems'];
        this.inventories = data['inventories'];
      }
    );
  }

  addOrRemoveCheck(specifier: string) {
    if (specifier === 'Add') {
      this.isAddToIngredientList = true;
    } else {
      this.isAddToIngredientList = false;
    }
  }

  checkIfIngredientsExist(inventoryId: number) {
    for (let i = 0; i < this.ingredients.length; i++) {
      if (this.ingredients[i].InventoryId === inventoryId) {
        return i;
      }
    }
    return -1;
  }

  getIngredientInfo(inventoryId: number, specifier: string) {
    const inventory = this.inventories.find(x => x.Id === inventoryId);
    if (inventory !== undefined || inventory !== null) {
      if (specifier === 'Name') {
        return inventory.Name;
      }
      if (specifier === 'Unit') {
        return inventory.Unit;
      }
      if (specifier === 'Price') {
        return inventory.AveragePrice;
      }
    }
    return '';
  }




  addIngredients(form: NgForm) {
    const ingredientId = null;
    const inventoryId = +form.value.inventoryId;
    const quantity = form.value.quantity;
    const averagePrice = this.inventories.find(x => x.Id === inventoryId).AveragePrice;
    const subTotal = quantity * averagePrice;
    const ingredientIndex = this.checkIfIngredientsExist(inventoryId);

    if (this.isAddToIngredientList) {
      if (ingredientIndex !== -1) {
        this.ingredients[ingredientIndex].Quantity += quantity;
        this.ingredients[ingredientIndex].SubTotal += subTotal;

      } else {

        const ingredient = new Ingredient(
          ingredientId,
          quantity,
          inventoryId,
          subTotal,
          null
        );
        this.ingredients.push(ingredient);
      }
      this.inventoryCost += subTotal;
    } else {

      if (ingredientIndex !== -1) {

        if (quantity < this.ingredients[ingredientIndex].Quantity) {

          this.ingredients[ingredientIndex].Quantity -= quantity;
          this.ingredients[ingredientIndex].SubTotal -= subTotal;
          this.inventoryCost -= subTotal;



        } else if (quantity === this.ingredients[ingredientIndex].Quantity) {
          this.inventoryCost -= subTotal;
          this.deleteIngredient(ingredientIndex);
          if (this.inventoryCost < 0) {
            this.inventoryCost = 0;
          }



        } else {
          this.toastr.errorToastr(
            'Quantity is too large',
            'Error',
            {
            newestOnTop: true,
            showCloseButton: true
          });
        }
      } else {
        this.toastr.errorToastr(
          'This item does not exist. Add to ingredient list first',
          'Error',
          {
            newestOnTop: true,
            showCloseButton: true
          });
      }
    }
    form.controls['quantity'].reset();
}

  handleFileInput(file: FileList) {
    const fileExtension = file.item(0).name.split('.').pop();

    if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
      this.fileToUpload = file.item(0);
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      };
      reader.readAsDataURL(this.fileToUpload);
    } else {
      this.imageUrl = 'assets/noImage.png';
      this.toastr.errorToastr('Unsupported file format', 'Error', {
        toastLife: 10000,
        newestOnTop: true,
        showCloseButton: true
      });

    }

  }

  deleteIngredient(index: number) {
    this.inventoryCost -= this.ingredients[index].SubTotal;
    this.ingredients.splice(index, 1);
  }



  addNewFoodItem(form: NgForm) {
    const serialNumber = form.value.serialNumber;

    if (this.foodItems.filter(e => e.SerialNumber === serialNumber).length > 0) {
      this.toastr.errorToastr('Duplicate serial number', 'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      return;
    }


    this.isDisabled = true;
    const name = form.value.itemName;
    const sellingPrice = form.value.sellingPrice;
    const profit = sellingPrice - this.inventoryCost;

    const foodItem = new FoodItem(
      null,
      serialNumber,
      name,
      sellingPrice,
      this.inventoryCost,
      profit,
      0,
      null,
      this.ingredients
    );

    this.foodItemDataStorageService.addNewFoodItem(foodItem)
      .subscribe(
      (foodItemId: any) => {
        if (this.imageUrl !== 'assets/noImage.png') {
          this.foodItemDataStorageService.uploadFoodItemImage(foodItemId, this.fileToUpload)
            .subscribe(
              (data: any) => {
                this.imageUrl = '/assets/noImage.png';
                form.reset();
                this.toastr.successToastr('Added to shop', 'Success', {
                  toastTimeout: 10000,
                  newestOnTop: true,
                  showCloseButton: true
                });
                this.router.navigate(['admin/food-items/', foodItemId]);
              }
            );
        } else {
          form.reset();
          this.toastr.successToastr('Added to shop', 'Success', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          this.router.navigate(['admin/food-items/', foodItemId]);
        }
      });


  }
}
