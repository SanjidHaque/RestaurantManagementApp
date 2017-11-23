import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import { HeaderComponent } from './header/header.component';
import { OurOffersComponent } from './our-offers/our-offers.component';
import {AppRoutingModule} from './app-router.module';
import {OurOffersService} from './our-offers/our-offers.service';
import { OurOffersListComponent } from './our-offers/our-offers-list/our-offers-list.component';
import { TComponent } from './t/t.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    OurOffersComponent,
    OurOffersListComponent,
    TComponent
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
