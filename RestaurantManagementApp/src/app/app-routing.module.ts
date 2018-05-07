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
import {FooditemListViewComponent} from './admin/food-item/fooditem-list-view/fooditem-list-view.component';
import {ListDetailsComponent} from './admin/food-item/fooditem-list-view/list-details/list-details.component';
import {FooditemGridViewComponent} from './admin/food-item/fooditem-grid-view/fooditem-grid-view.component';
import {GridDetailsComponent} from './admin/food-item/fooditem-grid-view/grid-details/grid-details.component';
import {InventoryListViewComponent} from './admin/inventory/inventory-list-view/inventory-list-view.component';
import {InventoryGridDetailsComponent} from './admin/inventory/inventory-grid-view/inventory-grid-details/inventory-grid-details.component';
import {InventoryListDetailsComponent} from './admin/inventory/inventory-list-view/inventory-list-details/inventory-list-details.component';
import {InventoryGridViewComponent} from './admin/inventory/inventory-grid-view/inventory-grid-view.component';
import {UpdateInventoryItemComponent} from './admin/inventory/update-inventory-item/update-inventory-item.component';
import {EditTableComponent} from './admin/tables/edit-table/edit-table.component';
import {TableResolverService} from './admin/tables/table-resolver.service';
import {FoodItemResolverService} from './admin/food-item/food-item-resolver.service';
import {OrderResolverService} from './admin/orders/order-resolver.service';
import {InventoryResolverService} from './admin/inventory/inventory-resolver.service';


const appRoutes: Routes = [
  { path: 'control-panel', component: ControlPanelComponent },
  { path: '', redirectTo: '/control-panel', pathMatch: 'full' },
  { path: 'payment', component: PaymentComponent },
  { path: 'receipt', component: ReceiptComponent },
  { path: 'our-offers', component: OurOffersComponent, resolve: { foodItems: FoodItemResolverService },
  children: [
    { path: 'all-categories', component: AllCategoriesComponent },
    { path: 'set-menu', component: OurOffersListComponent },
    { path: 'regulars', component: FoodItemsComponent, resolve: { foodItems: FoodItemResolverService } }
  ]
  },

  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'contact-us', component: ContactUsComponent},
  { path: 'chef', component: ChefComponent},
  { path: 'admin', component: AdminComponent, children: [
    { path: 'orders', component: OrdersComponent,
    children: [
      { path: 'list-view', component: OrderListViewComponent, resolve: { orders: OrderResolverService }},
      { path: 'list-details/:id', component: OrderListViewDetailsComponent, resolve: { orders: OrderResolverService }},
      { path: 'grid-view', component: OrderGridViewComponent, resolve: { orders: OrderResolverService }},
      { path: 'grid-details/:id', component: OrderGridViewDetailsComponent, resolve: { orders: OrderResolverService } }
    ]
    },
      { path: 'food-item', component: FoodItemComponent ,
       children: [
         { path: 'list-view', component: FooditemListViewComponent, resolve: { foodItems: FoodItemResolverService }},
         { path: 'list-details/:id', component: ListDetailsComponent, resolve: { foodItems: FoodItemResolverService }},
         { path: 'grid-view', component: FooditemGridViewComponent, resolve: { foodItems: FoodItemResolverService }},
         { path: 'grid-details/:id', component: GridDetailsComponent, resolve: { foodItems: FoodItemResolverService } },
         { path: 'add-new-food-item', component: AddNewFoodItemComponent},
         { path: 'edit-food-item/:id', component: EditFoodItemComponent }
       ]},
      { path: 'set-menu', component: AddSetMenuComponent},
    { path: 'summary-of-inventories', component: SummaryComponent },
    { path: 'tables', component: TablesComponent, resolve: { tables: TableResolverService }, children:
    [
      { path: 'add-new-table', component: AddNewTableComponent },
      { path: 'edit-table/:id', component: EditTableComponent }
      ]

    },
    { path: 'inventory', component: InventoryComponent ,
        children: [
        {path: 'add-new-inventory', component: AddNewInventoryComponent },
        {path: 'edit-inventory-item/:id', component: EditInventoryItemComponent, resolve: { inventories: InventoryResolverService }},
        {path: 'update-inventory-item/:id', component: UpdateInventoryItemComponent, resolve: { inventories: InventoryResolverService }},
          { path: 'list-view', component: InventoryListViewComponent, resolve: { inventories: InventoryResolverService }},
          { path: 'list-details/:id', component: InventoryListDetailsComponent, resolve: { inventories: InventoryResolverService }},
          { path: 'grid-view', component: InventoryGridViewComponent, resolve: { inventories: InventoryResolverService } },
          { path: 'grid-details/:id', component: InventoryGridDetailsComponent, resolve: { inventories: InventoryResolverService }},
      ]}
    ] },
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
