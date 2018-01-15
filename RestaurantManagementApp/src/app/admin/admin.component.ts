import {Component, Input, OnInit} from '@angular/core';
import {FoodItems} from '../shared/food-item.model';
import {Http, Response} from '@angular/http';
import {OurOffers} from '../our-offers/our-offers.model';
import {OurOffersService} from '../our-offers/our-offers.service';
import {Subject} from 'rxjs/Subject';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AdminDataService} from './data.service';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  newFoodItem: FoodItems;
  addNew = false;
  viewItem = false;
  editMode = false;
  itemForm: FormGroup;
  @Input() name: string;
  @Input() foodItemImage: string;
  @Input() price: number;
  @Input() id: number;
  foodItems: FoodItems[];
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
          console.log(this.foodItems);
        }
      );
  }

  onGetData() {
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


  onAddItem(foodItem: FoodItems) {
    this.addNew = true;
    if (this.editMode) {
      this.name = this.foodItems[this.id].Name;
      this.price = this.foodItems[this.id].Price;
    }
  }

  onSubmit() {
    if (this.editMode) {
      // this.onAddNewItem(foodItem);
    }
    const foodItem = new FoodItems(
      this.name, this.id , this.price
    );
    this.onEditItem();
  }

  onAddNewItem(foodItem: FoodItems) {
    this.dataService.postFoodItem(foodItem);
  }

  onEditItem() {
    this.editMode = true;
    // this.router.navigate(['edit-item'], {relativeTo: this.route});
    // const foodItem = this.foodItems[this.id];
    // // this.dataService.putFoodItem(foodItem);
    // this.onAddItem(foodItem);
  }

  onDeleteItem() {
    this.dataService.deleteFoodItem(this.id);
  }

  onCancel() {
    this.addNew = false;
  }

}
