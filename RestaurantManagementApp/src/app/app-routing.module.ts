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
import {AddNewFoodItemComponent} from './admin/food-item/add-new-food-item/add-new-food-item.component';
import {EditFoodItemComponent} from './admin/food-item/edit-food-item/edit-food-item.component';
import {AddIngredientsComponent} from './admin/food-item/add-new-food-item/add-ingredients/add-ingredients.component';
import {BillOfMaterialsComponent} from './admin/bill-of-materials/bill-of-materials.component';
import {SummaryComponent} from './admin/bill-of-materials/summary/summary.component';
import {CashFlowComponent} from './admin/bill-of-materials/cash-flow/cash-flow.component';
import {OurOffersListComponent} from './our-offers/our-offers-list/our-offers-list.component';
import {AllCategoriesComponent} from './our-offers/all-categories/all-categories.component';
import {PaymentComponent} from './our-offers/payment/payment.component';
import {ReceiptComponent} from './our-offers/receipt/receipt.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/our-offers/regulars', pathMatch: 'full' },
  { path: 'payment', component: PaymentComponent },
  { path: 'receipt', component: ReceiptComponent },
  { path: 'our-offers', component: OurOffersComponent,
  children: [
    { path: 'all-categories', component: AllCategoriesComponent },
    { path: 'set-menu', component: OurOffersListComponent },
    { path: 'regulars', component: FoodItemsComponent }
  ]
  },

  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'contact-us', component: ContactUsComponent},
  { path: 'chef', component: ChefComponent},
  { path: 'admin', component: AdminComponent, children: [
      { path: 'food-item', component: FoodItemComponent ,
       children: [
         { path: 'add-new-food-item/:id', component: AddNewFoodItemComponent,
         children: [
           { path: 'add-ingredients/:id', component: AddIngredientsComponent }
         ]},
         { path: 'edit-food-item/:id', component: EditFoodItemComponent }
       ]},
      { path: 'set-menu', component: AddSetMenuComponent},
      { path: 'reports', component: BillOfMaterialsComponent,
      children: [
        { path: 'inventories', component: SummaryComponent },
        { path: 'cash-flow', component: CashFlowComponent }
      ]},
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
