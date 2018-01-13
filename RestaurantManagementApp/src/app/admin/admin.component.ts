import {Component, Input, OnInit} from '@angular/core';
import {FoodItems} from '../shared/food-item.model';
import {Http, Response} from '@angular/http';
import {OurOffers} from '../our-offers/our-offers.model';
import {OurOffersService} from '../our-offers/our-offers.service';
import {Subject} from 'rxjs/Subject';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AdminDataService} from './data.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  newFoodItem: FoodItems;
  addNew = false;
  viewItem = false;
  itemForm: FormGroup;
  @Input() name: string;
  @Input() foodItemImage: string;
  @Input() price: number;
  @Input() id: number;
  foodItems: FoodItems[];
  itemAdded = new Subject<FoodItems[]>();

  constructor( private dataService: AdminDataService) {
    // this.foodItems = this.dataService.getFoods();
  }

  ngOnInit() {
    // let foodItems = this.dataService.getFoods();
  }

  onGetData() {
    this.viewItem = true;
    this.dataService.getFoods()
      .subscribe(
        (responce: Response) => {
          const data = responce.json();
          // console.log(data);
          this.foodItems = data.FoodItems;
          return this.foodItems;
        }
      );
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


  onAddItem() {
    this.addNew = true;
  }

  onSubmit() {
    const foodItem = new FoodItems(
      this.name, this.id , this.price, this.foodItemImage
    );
    this.onAddNewItem(foodItem);
  }
  onAddNewItem(foodItem: FoodItems) {
    this.foodItems.push(foodItem);
    this.itemAdded.next(this.foodItems.slice());
  }

  onCancel() {
    this.addNew = false;
  }

}
