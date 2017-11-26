import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import { HeaderComponent } from './header/header.component';
import { OurOffersComponent } from './our-offers/our-offers.component';
import {AppRoutingModule} from './app-routing.module';
import {OurOffersService} from './our-offers/our-offers.service';
import { FoodCartComponent } from './food-cart/food-cart.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PurchasedFoodComponent } from './purchased-food/purchased-food.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    OurOffersComponent,
    FoodCartComponent,
    HomePageComponent,
    PurchasedFoodComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [OurOffersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
