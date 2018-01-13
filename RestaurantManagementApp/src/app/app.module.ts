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
    FoodItemsComponent

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
    AdminDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
