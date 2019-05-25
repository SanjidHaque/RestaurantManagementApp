import {NgForm} from '@angular/forms';
import {ToastrManager} from 'ng6-toastr-notifications';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {FoodItem} from '../../../../models/food-item.model';
import {Inventory} from '../../../../models/inventory.model';
import {Ingredient} from '../../../../models/ingredient.model';
import {TableDataStorageService} from '../../../../services/data-storage/table-data-storage.service';
import {FoodItemDataStorageService} from '../../../../services/data-storage/food-item-data-storage.service';

@Component({
  selector: 'app-edit-food-item',
  templateUrl: './edit-food-item.component.html',
  styleUrls: ['./edit-food-item.component.scss']
})
export class EditFoodItemComponent implements OnInit {
  isDisabled = false;
  foodItemId: number;


  inventories: Inventory[] = [];
  foodItems: FoodItem[] = [];
  foodItem: FoodItem;

  sellingPrice = 0;
  inventoryCost = 0;
  isAddToIngredientList: boolean;

  rootUrl = '';
  fileToUpload: File = null;
  imageUrl = '';
  @ViewChild('Image') Image: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrManager,
              private tableDataStorageService: TableDataStorageService,
              private foodItemDataStorageService: FoodItemDataStorageService) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.foodItemId = +params['food-item-id'];
        }
      );
  }

  ngOnInit() {
    this.rootUrl = this.tableDataStorageService.rootUrl + '/Content/FoodItemImages/';
    this.route.data.
    subscribe(
      ( data: FoodItem[]) => {
        this.foodItems = data['foodItems'];
        this.inventories = data['inventories'];
        this.setFoodItemImage();
      }
    );

    this.foodItem = this.foodItems.find(x => x.Id === this.foodItemId);
    if (this.foodItem === undefined || this.foodItem === null) {
      this.toastr.errorToastr('Item is not found', 'Error', {
        toastLife: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      this.router.navigate(['admin/inventories']);
    } else {
      this.sellingPrice = this.foodItem.Price;
      this.inventoryCost = this.foodItem.InventoryCost;
    }
  }


  setFoodItemImage() {
    for (let i = 0; i < this.foodItems.length; i++) {
      if (this.foodItems[i].Id === this.foodItemId) {
        this.foodItem = this.foodItems[i];
        if ( this.foodItem.FoodItemImageName === null || this.foodItem.FoodItemImageName === '' ) {
          this.imageUrl = 'assets/noImage.png';
        } else {
          this.imageUrl =  this.rootUrl + this.foodItem.FoodItemImageName;
        }
      }
    }
  }

  addOrRemoveCheck(specifier: string) {
    if (specifier === 'Add') {
      this.isAddToIngredientList = true;
    } else {
      this.isAddToIngredientList = false;
    }
  }

  checkIfIngredientsExist(inventoryId: number) {
    for (let i = 0; i < this.foodItem.Ingredients.length; i++) {
      if (this.foodItem.Ingredients[i].InventoryId === inventoryId) {
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
    this.inventoryCost -= this.foodItem.Ingredients[index].SubTotal;
    this.foodItem.Ingredients.splice(index, 1);
  }

  editIngredients(form: NgForm) {
    const ingredientId = null;
    const inventoryId = +form.value.inventoryId;
    const quantity = form.value.quantity;
    const averagePrice = this.inventories.find(x => x.Id === inventoryId).AveragePrice;
    const subTotal = quantity * averagePrice;
    const ingredientIndex = this.checkIfIngredientsExist(inventoryId);

    if (this.isAddToIngredientList) {
      if (ingredientIndex !== -1) {
        this.foodItem.Ingredients[ingredientIndex].Quantity += quantity;
        this.foodItem.Ingredients[ingredientIndex].SubTotal += subTotal;

      } else {

        const ingredient = new Ingredient(
          ingredientId,
          quantity,
          inventoryId,
          subTotal,
          null
        );
        this.foodItem.Ingredients.push(ingredient);
      }
      this.inventoryCost += subTotal;
    } else {

      if (ingredientIndex !== -1) {

        if (quantity < this.foodItem.Ingredients[ingredientIndex].Quantity) {

          this.foodItem.Ingredients[ingredientIndex].Quantity -= quantity;
          this.foodItem.Ingredients[ingredientIndex].SubTotal -= subTotal;
          this.inventoryCost -= subTotal;



        } else if (quantity === this.foodItem.Ingredients[ingredientIndex].Quantity) {
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

  editFoodItem(form: NgForm) {
    const serialNumber = form.value.serialNumber;

    for (const value of this.foodItems) {
      if (value.SerialNumber === serialNumber && value.Id !== this.foodItemId) {
        this.toastr.errorToastr('Duplicate serial number', 'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        return;
      }
    }

    if (this.foodItem.Ingredients.length === 0) {

      this.toastr.errorToastr('Select at least one ingredient', 'Error', {
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
    for (const value of this.foodItem.Ingredients) {
      value.Id = null;
      value.FoodItemId = this.foodItemId;
    }

    const foodItem = new FoodItem(
      this.foodItemId,
      serialNumber,
      name,
      sellingPrice,
      this.inventoryCost,
      profit,
      0,
      null,
      this.foodItem.Ingredients
    );

    this.foodItemDataStorageService.editFoodItem(foodItem)
      .subscribe(
        (data: any) => {
          if (this.imageUrl !== 'assets/noImage.png' && this.fileToUpload !== null ) {
            this.foodItemDataStorageService.
            uploadFoodItemImage(this.foodItemId.toString(), this.fileToUpload)
              .subscribe(
                (response: any) => {
                  this.imageUrl = '/assets/noImage.png';
                  form.reset();
                  this.toastr.successToastr('Information is updated', 'Success', {
                    toastTimeout: 10000,
                    newestOnTop: true,
                    showCloseButton: true
                  });
                  this.router.navigate(['admin/food-items/', this.foodItemId]);
                }
              );
          } else {
            form.reset();
            this.toastr.successToastr('Information is updated', 'Success', {
              toastTimeout: 10000,
              newestOnTop: true,
              showCloseButton: true
            });
            this.router.navigate(['admin/food-items/', this.foodItemId]);
          }
        });


  }
}



