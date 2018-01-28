import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UuidModule } from 'ng2-uuid';
import { CarouselModule } from 'angular4-carousel';
import { CollapsibleModule } from 'angular4-collapsible';

import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import { HeaderComponent } from './header/header.component';
import { OurOffersComponent } from './our-offers/our-offers.component';
import {AppRoutingModule} from './app-routing.module';
import {OurOffersService} from './our-offers/our-offers.service';
import { FoodCartComponent } from './food-cart/food-cart.component';
import { HomePageComponent } from './home-page/home-page.component';
import { OurOffersListComponent } from './our-offers/our-offers-list/our-offers-list.component';
import {DataStorageService} from './shared/data-storage.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FooterComponent } from './footer/footer.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {PopupModule} from 'ng2-opd-popup';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AgmCoreModule } from '@agm/core';
import { ChefComponent } from './chef/chef.component';
import {FormsModule} from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import {AdminDataService} from './admin/data.service';
import { CheckingOrderComponent } from './checking-order/checking-order.component';
import {ChefServiceService} from './chef/chef-service.service';
import { FoodItemsComponent } from './our-offers/food-items/food-items.component';
import { AddSetMenuComponent } from './admin/add-set-menu/add-set-menu.component';
import { InventoryComponent } from './admin/inventory/inventory.component';
import { AddNewInventoryComponent } from './admin/inventory/add-new-inventory/add-new-inventory.component';
import { EditInventoryItemComponent } from './admin/inventory/edit-inventory-item/edit-inventory-item.component';
import { FoodItemComponent } from './admin/food-item/food-item.component';
import { AddNewFoodItemComponent } from './admin/food-item/add-new-food-item/add-new-food-item.component';
import { EditFoodItemComponent } from './admin/food-item/edit-food-item/edit-food-item.component';
import { AddIngredientsComponent } from './admin/food-item/add-new-food-item/add-ingredients/add-ingredients.component';
import { BillOfMaterialsComponent } from './admin/bill-of-materials/bill-of-materials.component';
import { SummaryComponent } from './admin/bill-of-materials/summary/summary.component';
import { SetMenuComponent } from './admin/set-menu/set-menu.component';
import {IngredientServiceService} from './admin/food-item/add-new-food-item/add-ingredients/ingredient-service.service';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    OurOffersComponent,
    FoodCartComponent,
    HomePageComponent,
    OurOffersListComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    ContactUsComponent,
    ChefComponent,
    AdminComponent,
    CheckingOrderComponent,
    FoodItemsComponent,
    AddSetMenuComponent,
    InventoryComponent,
    AddNewInventoryComponent,
    EditInventoryItemComponent,
    FoodItemComponent,
    AddNewFoodItemComponent,
    EditFoodItemComponent,
    AddIngredientsComponent,
    BillOfMaterialsComponent,
    SummaryComponent,
    SetMenuComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    UuidModule,
    CarouselModule,
    BrowserAnimationsModule,
    CollapsibleModule,
    CommonModule,
    FormsModule,
    PopupModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: ''

    })
  ],

  providers: [
    OurOffersService,
    DataStorageService,
    ChefServiceService,
    AdminDataService,
    IngredientServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
