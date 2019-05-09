import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../auth/auth.guard';
import {PaymentComponent} from '../components/point-of-sale/payment/payment.component';
import {InventoryResolverService} from '../route-resolvers/inventory-resolver.service';
import {TableResolverService} from '../route-resolvers/table-resolver.service';
import {FoodItemResolverService} from '../route-resolvers/food-item-resolver.service';
import {ForbiddenComponent} from '../components/forbidden/forbidden.component';
import {PointOfSaleComponent} from '../components/point-of-sale/point-of-sale.component';
import {MenuComponent} from '../components/point-of-sale/menu/menu.component';
import {LoginComponent} from '../components/login/login.component';
import {ResetPasswordComponent} from '../components/reset-password/reset-password.component';
import {AdminComponent} from '../components/admin/admin.component';
import {NewPasswordComponent} from '../components/new-password/new-password.component';
import {OrdersComponent} from '../components/admin/orders/orders.component';
import {UsersComponent} from '../components/admin/users/users.component';
import {OrderResolverService} from '../route-resolvers/order-resolver.service';
import {TablesComponent} from '../components/admin/tables/tables.component';
import {AddNewTableComponent} from '../components/admin/tables/add-new-table/add-new-table.component';
import {EditTableComponent} from '../components/admin/tables/edit-table/edit-table.component';
import {PageNotFoundComponent} from '../components/page-not-found/page-not-found.component';
import {SessionComponent} from '../components/point-of-sale/session/session.component';
import {SelectTableComponent} from '../components/point-of-sale/select-table/select-table.component';
import {FoodItemsComponent} from '../components/admin/food-items/food-items.component';
import {OrderListComponent} from '../components/admin/orders/order-list/order-list.component';
import {InventoriesComponent} from '../components/admin/inventories/inventories.component';
import {InventoryListComponent} from '../components/admin/inventories/inventory-list/inventory-list.component';
import {InventoryDetailsComponent} from '../components/admin/inventories/inventory-details/inventory-details.component';
import {OrderDetailsComponent} from '../components/admin/orders/order-details/order-details.component';
import {TableListComponent} from '../components/admin/tables/table-list/table-list.component';
import {FoodItemDetailsComponent} from '../components/admin/food-items/food-item-details/food-item-details.component';
import {FoodItemListComponent} from '../components/admin/food-items/food-item-list/food-item-list.component';
import {EditFoodItemComponent} from '../components/admin/food-items/edit-food-item/edit-food-item.component';
import {AddNewFoodItemComponent} from '../components/admin/food-items/add-new-food-item/add-new-food-item.component';
import {EditInventoryItemComponent} from '../components/admin/inventories/edit-inventory-item/edit-inventory-item.component';
import {AddNewInventoryItemComponent} from '../components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component';
import {TableDetailsComponent} from '../components/admin/tables/table-details/table-details.component';
import {UpdateInventoryItemComponent} from '../components/admin/inventories/update-inventory-item/update-inventory-item.component';
import {UserListComponent} from '../components/admin/users/user-list/user-list.component';
import {UserResolverService} from '../route-resolvers/user-resolver.service';
import {AddNewUserComponent} from '../components/admin/users/add-new-user/add-new-user.component';
import {UserDetailsComponent} from '../components/admin/users/user-details/user-details.component';
import {EditUserComponent} from '../components/admin/users/edit-user/edit-user.component';
import {RoleResolverService} from '../route-resolvers/role-resolver.service';
import {ChangePasswordByAdminComponent} from '../components/admin/users/change-password-by-admin/change-password-by-admin.component';


const appRoutes: Routes = [

  {
    path: 'pos',
    component: PointOfSaleComponent,
    canActivate: [AuthGuard],
    resolve:
      {
        inventories: InventoryResolverService,
        tables: TableResolverService,
        foodItems: FoodItemResolverService
      },
    children:
    [
      {
        path: '',
        redirectTo: 'session',
        pathMatch: 'full'
      },
      {
        path: 'session',
        component: SessionComponent,
      },
      {
        path: 'select-table',
        component: SelectTableComponent
      },
      {
        path: 'menu',
        component: MenuComponent
      },
      {
        path: 'payment',
        component: PaymentComponent
      },
    ]
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
          redirectTo: 'inventories',
          pathMatch: 'full'
        },
        {
          path: 'food-items',
          component: FoodItemsComponent,
          children:
            [
              {
                path: '',
                redirectTo: 'food-item-list',
                pathMatch: 'full'
              },
              {
                path: 'food-item-list',
                component: FoodItemListComponent,
                resolve:
                  {
                    foodItems: FoodItemResolverService
                  }
              },
              {
                path: 'add-new-food-item',
                component: AddNewFoodItemComponent,
                resolve:
                  {
                    foodItems: FoodItemResolverService,
                    inventories: InventoryResolverService
                  }
              },
              {
                path: ':foodItem-id',
                component: FoodItemDetailsComponent,
                resolve:
                  {
                    foodItems: FoodItemResolverService,
                    inventories: InventoryResolverService
                  }
              },
              {
                path: ':foodItem-id/edit-food-item',
                component: EditFoodItemComponent,
                resolve:
                  {
                    foodItems: FoodItemResolverService,
                    inventories: InventoryResolverService
                  }
              }
            ]
        },
        {
          path: 'inventories',
          component: InventoriesComponent,
          children:
            [
              {
                path: '',
                redirectTo: 'inventory-list',
                pathMatch: 'full'
              },
              {
                path: 'inventory-list',
                component: InventoryListComponent,
                resolve:
                  {
                    inventories: InventoryResolverService
                  }
              },
              {
                path: 'add-new-inventory-item',
                component: AddNewInventoryItemComponent
              },
              {
                path: ':inventory-id',
                component: InventoryDetailsComponent,
                resolve:
                  {
                    inventories: InventoryResolverService
                  }
              },
              {
                path: ':inventory-id/edit-inventory-item',
                component: EditInventoryItemComponent,
                resolve:
                  {
                    inventories: InventoryResolverService
                  }
              },
              {
                path: ':inventory-id/update-inventory-item',
                component: UpdateInventoryItemComponent,
                resolve:
                  {
                    inventories: InventoryResolverService
                  }
              }
            ]
        },
        {
          path: 'orders',
          component: OrdersComponent,
          children:
            [
              {
                path: '',
                redirectTo: 'order-list',
                pathMatch: 'full'
              },
              {
                path: 'order-list',
                component: OrderListComponent,
                resolve:
                  {
                    orders: OrderResolverService
                  }
              },
              {
                path: ':id',
                component: OrderDetailsComponent,
                resolve:
                  {
                    orders: OrderResolverService
                  }
              }
            ]
        },
        {
          path: 'tables',
          component: TablesComponent,
          children:
            [
              {
                path: '',
                redirectTo: 'table-list',
                pathMatch: 'full'
              },
              {
                path: 'table-list',
                component: TableListComponent,
                resolve:
                  {
                    tables: TableResolverService
                  }
              },
              {
                path: 'add-new-table',
                component: AddNewTableComponent
              },
              {
                path: ':table-id',
                component: TableDetailsComponent,
                resolve:
                  {
                    tables: TableResolverService
                  }
              },
              {
                path: ':table-id/edit-table',
                component: EditTableComponent,
                resolve:
                  {
                    tables: TableResolverService
                  }
              }
            ]
        },
        {
          path: 'user-accounts',
          component: UsersComponent,
          children:
            [
              {
                path: '',
                redirectTo: 'user-account-list',
                pathMatch: 'full'
              },
              {
                path: 'user-account-list',
                component: UserListComponent,
                resolve:
                  {
                    users: UserResolverService
                  }
              },
              {
                path: 'add-new-user-account',
                component: AddNewUserComponent,
                resolve:
                  {
                    roles: RoleResolverService
                  }
              },
              {
                path: ':user-account-id',
                component: UserDetailsComponent,
                resolve:
                  {
                    users: UserResolverService
                  }
              },
              {
                path: ':user-account-id/edit-user-account',
                component: EditUserComponent,
                resolve:
                  {
                    users: UserResolverService
                  }
              },
              {
                path: ':user-account-id/change-password-by-admin',
                component: ChangePasswordByAdminComponent,
                resolve:
                  {
                    users: UserResolverService
                  }
              }
            ]
        }
      ]
  },

  {
    path : '',
    redirectTo: 'login',
    pathMatch : 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'forbidden',
    component: ForbiddenComponent,
    canActivate: [AuthGuard]
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
