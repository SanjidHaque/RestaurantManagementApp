import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OurOffersComponent} from './our-offers/our-offers.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AdminComponent} from './admin/admin.component';
import {InventoryComponent} from './admin/inventory/inventory.component';
import {AddNewInventoryComponent} from './admin/inventory/add-new-inventory/add-new-inventory.component';
import {EditInventoryItemComponent} from './admin/inventory/edit-inventory-item/edit-inventory-item.component';
import {FoodItemsComponent} from './our-offers/food-items/food-items.component';
import {FoodItemComponent} from './admin/food-item/food-item.component';
import {AddNewFoodItemComponent} from './admin/food-item/add-new-food-item/add-new-food-item.component';
import {EditFoodItemComponent} from './admin/food-item/edit-food-item/edit-food-item.component';
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
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AuthGuard} from './auth.guard';
import {ForbiddenComponent} from './forbidden/forbidden.component';
import {RoleResolverService} from './role-resolver';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {NewPasswordComponent} from './new-password/new-password.component';
import {ModifiedUserResolverService} from './shared/modified-user-resolver.service';
import {AddFoodItemImageComponent} from './admin/food-item/add-food-item-image/add-food-item-image.component';
import {EditFoodItemImageComponent} from './admin/food-item/edit-food-item-image/edit-food-item-image.component';


const appRoutes: Routes = [
  { path: 'control-panel',
    component: ControlPanelComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] }
   },
  { path: 'payment', component: PaymentComponent,  canActivate: [AuthGuard],
    resolve: { inventories: InventoryResolverService,
      tables: TableResolverService,
      foodItems: FoodItemResolverService
    }
  },
  { path: 'receipt', component: ReceiptComponent,  canActivate: [AuthGuard] },
  { path: 'forbidden', component: ForbiddenComponent, canActivate: [AuthGuard] },
  { path: 'our-offers', component: OurOffersComponent, canActivate: [AuthGuard],
    resolve: {
      inventories: InventoryResolverService,
      foodItems: FoodItemResolverService
    },
  children: [
    { path: 'regulars', component: FoodItemsComponent, canActivate: [AuthGuard]
    }
  ]
  },

  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'new-password', component: NewPasswordComponent },


  { path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
     data: { roles: ['Admin'] },
    children: [
      {
        path: '',
        redirectTo: 'food-item',
        pathMatch: 'full'
      },
      { path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuard],
        resolve: { roles: RoleResolverService, users: ModifiedUserResolverService }},
    { path: 'orders', component: OrdersComponent,
      canActivate: [AuthGuard],

    children: [
      { path: 'list-view', component: OrderListViewComponent
        , canActivate: [AuthGuard],
        resolve: { orders: OrderResolverService }},
      { path: 'list-details/:id', component: OrderListViewDetailsComponent,
        canActivate: [AuthGuard],
        resolve: { orders: OrderResolverService }},
      { path: 'grid-view', component: OrderGridViewComponent,
        canActivate: [AuthGuard],
        resolve: { orders: OrderResolverService }},
      { path: 'grid-details/:id', component: OrderGridViewDetailsComponent,
        canActivate: [AuthGuard],
        resolve: { orders: OrderResolverService } }
    ]
    },
      { path: 'food-item', component: FoodItemComponent,
        canActivate: [AuthGuard],
       children: [
         { path: 'list-view', component: FooditemListViewComponent,
           canActivate: [AuthGuard],
           resolve: { foodItems: FoodItemResolverService }},
         { path: 'list-details/:id', component: ListDetailsComponent,
           canActivate: [AuthGuard],
           resolve: { foodItems: FoodItemResolverService }},
         { path: 'grid-view', component: FooditemGridViewComponent,
           canActivate: [AuthGuard],
           resolve: { foodItems: FoodItemResolverService }},
         { path: 'grid-details/:id', component: GridDetailsComponent,
           canActivate: [AuthGuard],
           resolve: { foodItems: FoodItemResolverService } },
         { path: 'add-new-food-item', component: AddNewFoodItemComponent,
           canActivate: [AuthGuard],
           resolve: { inventories: InventoryResolverService }},
         { path: 'add-food-item-image/:id', component: AddFoodItemImageComponent,
           canActivate: [AuthGuard],
           },
         { path: 'edit-food-item/:id', component: EditFoodItemComponent,
           canActivate: [AuthGuard],
           resolve: {
             foodItems: FoodItemResolverService,
             inventories: InventoryResolverService }
           },
         { path: 'edit-food-item-image/:id', component: EditFoodItemImageComponent,
           canActivate: [AuthGuard],
           resolve: {  foodItems: FoodItemResolverService }
         }
       ]},
    { path: 'tables', component: TablesComponent,
      canActivate: [AuthGuard],
      resolve: { tables: TableResolverService }, children:
    [
      { path: 'add-new-table', component: AddNewTableComponent,
        canActivate: [AuthGuard]
      },
      { path: 'edit-table/:id', component: EditTableComponent,
        canActivate: [AuthGuard],
        resolve: { tables: TableResolverService }}
      ]

    },
    { path: 'inventory',
      component: InventoryComponent ,
      canActivate: [AuthGuard],
        children: [
        {path: 'add-new-inventory', component: AddNewInventoryComponent
          , canActivate: [AuthGuard]
        },
        {path: 'edit-inventory-item/:id', component: EditInventoryItemComponent,
          canActivate: [AuthGuard],
          resolve: { inventories: InventoryResolverService }},
        {path: 'update-inventory-item/:id', component: UpdateInventoryItemComponent,
          canActivate: [AuthGuard],
          resolve: { inventories: InventoryResolverService }},
          { path: 'list-view', component: InventoryListViewComponent,
            canActivate: [AuthGuard],
            resolve: { inventories: InventoryResolverService }},
          { path: 'list-details/:id', component: InventoryListDetailsComponent,
            canActivate: [AuthGuard],
            resolve: { inventories: InventoryResolverService }},
          { path: 'grid-view', component: InventoryGridViewComponent,
            canActivate: [AuthGuard],
            resolve: { inventories: InventoryResolverService } },
          { path: 'grid-details/:id', component: InventoryGridDetailsComponent,
            canActivate: [AuthGuard],
            resolve: { inventories: InventoryResolverService }}
      ]}
    ] },
  { path : '', redirectTo: '/login', pathMatch : 'full'},
  { path: 'not-found', component: PageNotFoundComponent,
    canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/not-found' }
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
