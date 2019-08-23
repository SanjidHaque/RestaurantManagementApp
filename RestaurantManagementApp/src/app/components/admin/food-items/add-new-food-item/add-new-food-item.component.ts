import {NgForm} from '@angular/forms';
import {ToastrManager} from 'ng6-toastr-notifications';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {FoodItem} from '../../../../models/food-item.model';
import {Inventory} from '../../../../models/inventory.model';
import {Ingredient} from '../../../../models/ingredient.model';
import {AdminService} from '../../../../services/shared/admin.service';
import {FoodItemDataStorageService} from '../../../../services/data-storage/food-item-data-storage.service';

@Component({
  selector: 'app-add-new-food-item',
  templateUrl: './add-new-food-item.component.html',
  styleUrls: ['./add-new-food-item.component.scss']
})

export class AddNewFoodItemComponent implements OnInit {
  isDisabled = false;

  inventories: Inventory[] = [];
  ingredients: Ingredient[] = [];

  sellingPrice = 0;
  inventoryCost = 0;
  isAddToIngredientList: boolean;


  fileToUpload: File = null;
  imageUrl = 'assets/noImage.png';
  @ViewChild('Image', { static: false }) Image: any;

  constructor(private route: ActivatedRoute,
              private toastr: ToastrManager,
              private adminService: AdminService,
              private router: Router,
              private foodItemDataStorageService: FoodItemDataStorageService,
           ) {}

  ngOnInit() {
    this.route.data.
    subscribe(
      (data: Data) => {
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

        if (quantity <= this.ingredients[ingredientIndex].Quantity) {

          if (quantity === this.ingredients[ingredientIndex].Quantity) {
            this.deleteIngredient(ingredientIndex);

        } else {
            this.ingredients[ingredientIndex].Quantity -= quantity;
            this.ingredients[ingredientIndex].SubTotal -= subTotal;
            this.inventoryCost -= subTotal;
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
        this.toastr.errorToastr('This item does not exist. Add to ingredient list first', 'Error');
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
      this.toastr.errorToastr('Unsupported file format', 'Error');
    }

  }

  deleteIngredient(index: number) {
    this.inventoryCost -= this.ingredients[index].SubTotal;
    this.ingredients.splice(index, 1);
  }

  addNewFoodItem(form: NgForm) {
    if (this.ingredients.length === 0) {
      this.toastr.errorToastr('Select at least one ingredient', 'Error');
      return;
    }

    const sellingPrice = form.value.sellingPrice;
    if (!this.adminService.checkNumericConditions(sellingPrice)) {
      return;
    }

    if (sellingPrice < this.inventoryCost) {
      this.toastr.errorToastr('Price is too small', 'Error');
      return;
    }

    this.isDisabled = true;
    const serialNumber = form.value.serialNumber;
    const name = form.value.itemName;
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
      (response: any) => {

        if (response.StatusText !== 'Success') {
          this.isDisabled = false;
          this.toastr.errorToastr(response.StatusText, 'Error');
          return;
        }

        if (this.imageUrl !== 'assets/noImage.png') {
          this.foodItemDataStorageService
            .uploadFoodItemImage(response.foodItem.Id, this.fileToUpload)
            .subscribe(() => {
                this.imageUrl = '/assets/noImage.png';
                this.toastr.successToastr('Added to shop', 'Success');
                this.router.navigate(['admin/food-items/', response.Id]);
              });
        } else {
          this.toastr.successToastr('Added to shop', 'Success');
          this.router.navigate(['admin/food-items/', response.Id]);
        }
      });

  }
}
