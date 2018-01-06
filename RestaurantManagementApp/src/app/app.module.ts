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
    ChefComponent

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
    PopupModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: ''

    })
  ],
  providers: [OurOffersService, DataStorageService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
