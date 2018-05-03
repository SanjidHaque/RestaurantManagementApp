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
import {TablesComponent} from './admin/tables/tables.component';
import {AddNewTableComponent} from './admin/tables/add-new-table/add-new-table.component';
import {ControlPanelComponent} from './control-panel/control-panel.component';
import {OrdersComponent} from './admin/orders/orders.component';
import {OrderListViewComponent} from './admin/orders/order-list-view/order-list-view.component';
import {OrderListViewDetailsComponent} from './admin/orders/order-list-view/order-list-view-details/order-list-view-details.component';
import {OrderGridViewComponent} from './admin/orders/order-grid-view/order-grid-view.component';
import {OrderGridViewDetailsComponent} from './admin/orders/order-grid-view/order-grid-view-details/order-grid-view-details.component';


const appRoutes: Routes = [
  { path: 'control-panel', component: ControlPanelComponent },
  { path: '', redirectTo: '/control-panel', pathMatch: 'full' },
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
    { path: 'orders', component: OrdersComponent,
    children: [
      { path: 'list-view', component: OrderListViewComponent},
      { path: 'list-details/:id', component: OrderListViewDetailsComponent},
      { path: 'grid-view', component: OrderGridViewComponent},
      { path: 'grid-details/:id', component: OrderGridViewDetailsComponent }
    ]
    },
      { path: 'food-item', component: FoodItemComponent ,
       children: [
         { path: 'add-new-food-item/:id', component: AddNewFoodItemComponent,
         children: [
           { path: 'add-ingredients/:id', component: AddIngredientsComponent }
         ]},
         { path: 'edit-food-item/:id', component: EditFoodItemComponent }
       ]},
      { path: 'set-menu', component: AddSetMenuComponent},
   /* { path: 'orders', component: CashFlowComponent },*/
    { path: 'summary-of-inventories', component: SummaryComponent },
    { path: 'tables', component: TablesComponent, children:
    [
      { path: 'add-new-table', component: AddNewTableComponent }
      ]

    },
      /*{ path: 'reports', component: BillOfMaterialsComponent,
      children: [
        { path: 'summary-of-inventories', component: SummaryComponent }
        /!*{ path: 'orders', component: CashFlowComponent }*!/
      ]},*/
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
