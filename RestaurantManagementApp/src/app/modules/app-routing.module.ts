import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ControlPanelComponent} from '../components/control-panel/control-panel.component';
import {AuthGuard} from '../auth/auth.guard';
import {PaymentComponent} from '../components/point-of-sale/payment/payment.component';
import {InventoryResolverService} from '../route-resolvers/inventory-resolver.service';
import {TableResolverService} from '../route-resolvers/table-resolver.service';
import {FoodItemResolverService} from '../route-resolvers/food-item-resolver.service';
import {ReceiptComponent} from '../components/point-of-sale/receipt/receipt.component';
import {ForbiddenComponent} from '../components/forbidden/forbidden.component';
import {PointOfSaleComponent} from '../components/point-of-sale/point-of-sale.component';
import {FoodItemsComponent} from '../components/point-of-sale/food-items/food-items.component';
import {LoginComponent} from '../components/login/login.component';
import {ResetPasswordComponent} from '../components/reset-password/reset-password.component';
import {AdminComponent} from '../components/admin/admin.component';
import {NewPasswordComponent} from '../components/new-password/new-password.component';
import {ModifiedUserResolverService} from '../route-resolvers/modified-user-resolver.service';
import {OrdersComponent} from '../components/admin/orders/orders.component';
import {RoleResolverService} from '../route-resolvers/role-resolver';
import {RegisterComponent} from '../components/register/register.component';
import {OrderListViewComponent} from '../components/admin/orders/order-list-view/order-list-view.component';
import {OrderResolverService} from '../route-resolvers/order-resolver.service';
import {OrderListViewDetailsComponent} from '../components/admin/orders/order-list-view/order-list-view-details/order-list-view-details.component';
import {FoodItemComponent} from '../components/admin/food-item/food-item.component';
import {FooditemListViewComponent} from '../components/admin/food-item/fooditem-list-view/fooditem-list-view.component';
import {ListDetailsComponent} from '../components/admin/food-item/fooditem-list-view/list-details/list-details.component';
import {AddNewFoodItemComponent} from '../components/admin/food-item/add-new-food-item/add-new-food-item.component';
import {AddFoodItemImageComponent} from '../components/admin/food-item/add-food-item-image/add-food-item-image.component';
import {EditFoodItemComponent} from '../components/admin/food-item/edit-food-item/edit-food-item.component';
import {EditFoodItemImageComponent} from '../components/admin/food-item/edit-food-item-image/edit-food-item-image.component';
import {TablesComponent} from '../components/admin/tables/tables.component';
import {AddNewTableComponent} from '../components/admin/tables/add-new-table/add-new-table.component';
import {EditTableComponent} from '../components/admin/tables/edit-table/edit-table.component';
import {InventoryComponent} from '../components/admin/inventory/inventory.component';
import {EditInventoryItemComponent} from '../components/admin/inventory/edit-inventory-item/edit-inventory-item.component';
import {AddNewInventoryComponent} from '../components/admin/inventory/add-new-inventory/add-new-inventory.component';
import {UpdateInventoryItemComponent} from '../components/admin/inventory/update-inventory-item/update-inventory-item.component';
import {InventoryListViewComponent} from '../components/admin/inventory/inventory-list-view/inventory-list-view.component';
import {InventoryListDetailsComponent} from '../components/admin/inventory/inventory-list-view/inventory-list-details/inventory-list-details.component';
import {PageNotFoundComponent} from '../components/page-not-found/page-not-found.component';


const appRoutes: Routes = [
  {
    path: 'control-panel',
    component: ControlPanelComponent,
    canActivate: [AuthGuard],
    data:
      {
        roles: ['Admin']
      }
  },

  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [AuthGuard],
    resolve:
      {
        inventories: InventoryResolverService,
        tables: TableResolverService,
        foodItems: FoodItemResolverService
      }
  },


  { path: 'receipt',
    component: ReceiptComponent,
    canActivate: [AuthGuard]
  },


  { path: 'forbidden',
    component: ForbiddenComponent,
    canActivate: [AuthGuard]
  },

  { path: 'point-of-sale',
    component: PointOfSaleComponent,
    canActivate: [AuthGuard],
    resolve:
      {
        inventories: InventoryResolverService,
        foodItems: FoodItemResolverService
      },
    children:
      [
        { path: 'food-items',
          component: FoodItemsComponent,
          canActivate: [AuthGuard]
        }
      ]
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },

  {
    path: 'new-password',
    component: NewPasswordComponent
  },


  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data:
      {
        roles: ['Admin']
      },
    children:
      [
        {
          path: '',
          redirectTo: 'food-item',
          pathMatch: 'full'
        },
        {
          path: 'register',
          component: RegisterComponent,
          canActivate: [AuthGuard],
          resolve:
            { roles: RoleResolverService,
              users: ModifiedUserResolverService
            }
        },
        { path: 'order',
          component: OrdersComponent,
          canActivate: [AuthGuard],
          children:
            [
              {
                path: 'list-view',
                component: OrderListViewComponent,
                canActivate: [AuthGuard],
                resolve:
                  {
                    orders: OrderResolverService
                  }
              },
              {
                path: 'list-details/:id',
                component: OrderListViewDetailsComponent,
                canActivate: [AuthGuard],
                resolve:
                  {
                    orders: OrderResolverService
                  }
              }
            ]
        },

        {
          path: 'food-item',
          component: FoodItemComponent,
          canActivate: [AuthGuard],
          children:
            [
              {
                path: 'list-view',
                component: FooditemListViewComponent,
                canActivate: [AuthGuard],
                resolve:
                  {
                    foodItems: FoodItemResolverService
                  }
              },
            {
              path: 'list-details/:id',
              component: ListDetailsComponent,
              canActivate: [AuthGuard],
              resolve:
                {
                  foodItems: FoodItemResolverService
                }
            },
            {
              path: 'add-new-food-item',
              component: AddNewFoodItemComponent,
              canActivate: [AuthGuard],
              resolve:
                {
                  inventories: InventoryResolverService
                }
            },
            {
              path: 'add-food-item-image/:id',
              component: AddFoodItemImageComponent,
              canActivate: [AuthGuard],
            },
            {
              path: 'edit-food-item/:id',
              component: EditFoodItemComponent,
              canActivate: [AuthGuard],
              resolve:
                {
                  foodItems: FoodItemResolverService,
                  inventories: InventoryResolverService
                }
            },
            {
              path: 'edit-food-item-image/:id',
              component: EditFoodItemImageComponent,
              canActivate: [AuthGuard],
              resolve:
                {
                  foodItems: FoodItemResolverService
                }
            }
          ]
        },
        {
          path: 'tables',
          component: TablesComponent,
          canActivate: [AuthGuard],
          resolve:
            {
              tables: TableResolverService
            },
          children:
            [
              {
                path: 'add-new-tables',
                component: AddNewTableComponent,
                canActivate: [AuthGuard]
              },
              {
                path: 'edit-tables/:id',
                component: EditTableComponent,
                canActivate: [AuthGuard],
                resolve:
                  {
                    tables: TableResolverService
                  }
              }
            ]

        },
        {
          path: 'inventories',
          component: InventoryComponent,
          canActivate: [AuthGuard],
          children:
            [
              {
                path: 'add-new-inventories',
                component: AddNewInventoryComponent,
                canActivate: [AuthGuard]
              },
              {
                path: 'edit-inventories-item/:id',
                component: EditInventoryItemComponent,
                canActivate: [AuthGuard],
                resolve:
                  {
                    inventories: InventoryResolverService
                  }
              },
              {
                path: 'update-inventories-item/:id',
                component: UpdateInventoryItemComponent,
                canActivate: [AuthGuard],
                resolve:
                  {
                    inventories: InventoryResolverService
                  }
              },
              {
                path: 'list-view',
                component: InventoryListViewComponent,
                canActivate: [AuthGuard],
                resolve:
                  {
                    inventories: InventoryResolverService
                  }
              },
              {
                path: 'list-details/:id',
                component: InventoryListDetailsComponent,
                canActivate: [AuthGuard],
                resolve:
                  {
                    inventories: InventoryResolverService
                  }
              }
            ]
        }
      ]

  },

  {
    path : '',
    redirectTo: '/login',
    pathMatch : 'full'
  },

  {
    path: 'not-found',
    component: PageNotFoundComponent,
    canActivate: [AuthGuard]
  },

  {
    path: '**',
    redirectTo: '/not-found'
  }

];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
