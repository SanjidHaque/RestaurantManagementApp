import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OurOffersComponent} from './our-offers/our-offers.component';
import {HeaderComponent} from './header/header.component';
import {OurOffersListComponent} from './our-offers/our-offers-list/our-offers-list.component';

const appRoutes: Routes = [
  { path: 'header', component: HeaderComponent },
  {path: 'our-offers', component: OurOffersComponent},
  {path: 'our-offers-list', component: OurOffersListComponent  }
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
