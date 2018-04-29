import {Component, Input, OnInit} from '@angular/core';
import {FoodItems} from '../shared/food-item.model';
import {OurOffers} from '../our-offers/our-offers.model';
import {Subject} from 'rxjs/Subject';
import {Form, FormArray, FormGroup, NgForm} from '@angular/forms';
import {AdminDataService} from './data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SetMenuItems} from '../shared/set-menu-items.model';
import {variable} from '@angular/compiler/src/output/output_ast';
import index from '@angular/cli/lib/cli';
import {SetFoodItemsArry} from './setMenuFoodItem.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  addNew = false;
  viewItem = false;
  editMode = false;
  addSetMenu = false;
  @Input() name: string;
  @Input() price: number;
  @Input() id: number;
  foodItems: FoodItems[];
  setMenuItems: SetFoodItemsArry;
  itemAdded = new Subject<FoodItems[]>();

  constructor( private dataService: AdminDataService,
               private route: ActivatedRoute,
               private router: Router) {
    // this.foodItems = this.dataService.getFoods();
  }

  ngOnInit() {
    // let foodItems = this.dataService.getFoods();
    this.dataService.getFoodItems()
      .subscribe(
        (manu: OurOffers) => {
          this.foodItems = manu.FoodItems;
        }
      );
  }

  onGetData() {
    this.onCancel();
    this.viewItem = true;
  }


  // private initForm() {
  //     const itemName = '';
  //     const itemPrice = +'';
  //
  //     this.itemForm = new FormGroup({
  //       'name': new FormControl(itemName, Validators.required),
  //       'price': new FormControl(itemPrice, Validators.required)
  //     });
  //   }


  onCancel() {
    this.addNew = false;
    if (this.editMode) {
      this.editMode = false;
      this.name = '';
      this.price = null;
      this.router.navigate(['/admin']);
    }
    if (this.addSetMenu) {
      this.addSetMenu = false;
    }
  }

  onAddMenu() {
    this.onCancel();
    this.addSetMenu = true;
  }

 /* onSubmitSetMenu(formValue: NgForm) {
  //   this.setMenuItems = [
  //     {this.foodItems}
  // }
  //
  //   ]
  // }
    const setFoodItems =  formValue.value;
    if (setFoodItems.isSelected === true) {
      // this.setMenuItems.foodItems = setFoodItems.foodItems;
    }*/

  // onSubmitSetMenu(formValue: NgForm) {
  // //   this.setMenuItems = [
  // //     {this.foodItems}
  // // }
  // //
  // //   ]
  // // }
  //   const setFoodItems =  formValue.value;
  //   if (setFoodItems.isSelected === true) {
  //     this.setMenuItems.foodItems = setFoodItems.foodItems;
  //   }


  goToRegulars() {
    this.router.navigate(['admin/food-item']);
  }

  goToInventories() {
    this.router.navigate(['admin/inventory']);
  }

  goToTables() {
    this.router.navigate(['admin/tables']);
  }
  goToSummaryOfInventories() {
    this.router.navigate(['admin/summary-of-inventories']);
  }
  goToOrders() {
    this.router.navigate(['admin/orders']);
  }
}
