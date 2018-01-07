import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OurOffersComponent} from './our-offers/our-offers.component';
import {FoodCartComponent} from './food-cart/food-cart.component';
import {HomePageComponent} from './home-page/home-page.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ContactUsComponent} from './contact-us/contact-us.component';
import {ChefComponent} from './chef/chef.component';
import {AdminComponent} from './admin/admin.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomePageComponent },
  { path: 'our-offers', component: OurOffersComponent },
  { path: 'food-cart', component: FoodCartComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'contact-us', component: ContactUsComponent},
  { path: 'chef', component: ChefComponent},
  { path: 'admin', component: AdminComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
