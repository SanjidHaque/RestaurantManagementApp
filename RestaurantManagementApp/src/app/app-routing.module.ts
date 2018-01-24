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
import {CheckingOrderComponent} from './checking-order/checking-order.component';
import {AddSetMenuComponent} from './admin/add-set-menu/add-set-menu.component';
import {InventoryComponent} from './admin/inventory/inventory.component';
import {AddNewInventoryComponent} from './admin/inventory/add-new-inventory/add-new-inventory.component';
import {EditInventoryItemComponent} from './admin/inventory/edit-inventory-item/edit-inventory-item.component';
import {FoodItemsComponent} from './our-offers/food-items/food-items.component';
import {FoodItemComponent} from './admin/food-item/food-item.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomePageComponent },
  { path: 'our-offers', component: OurOffersComponent },
  { path: 'food-cart', component: FoodCartComponent, children: [
    { path: 'checking-orders', component: CheckingOrderComponent }
    ] },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'contact-us', component: ContactUsComponent},
  { path: 'chef', component: ChefComponent},
  { path: 'admin', component: AdminComponent, children: [
      { path: 'food-item', component: FoodItemComponent},
      { path: 'set-menu', component: AddSetMenuComponent},
      { path: 'inventory', component: InventoryComponent ,
        children: [
        {path: 'add-new-inventory', component: AddNewInventoryComponent },
        {path: 'edit-inventory-item/:id', component: EditInventoryItemComponent }

      ]}
    ] },
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
