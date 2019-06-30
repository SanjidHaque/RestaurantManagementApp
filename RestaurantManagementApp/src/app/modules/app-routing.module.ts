import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../auth/auth.guard';
import {PaymentComponent} from '../components/point-of-sale/payment/payment.component';
import {InventoriesResolverService} from '../route-resolvers/inventories-resolver.service';
import {TablesResolverService} from '../route-resolvers/tables-resolver.service';
import {FoodItemsResolverService} from '../route-resolvers/food-items-resolver.service';
import {ForbiddenComponent} from '../components/forbidden/forbidden.component';
import {PointOfSaleComponent} from '../components/point-of-sale/point-of-sale.component';
import {MenuComponent} from '../components/point-of-sale/menu/menu.component';
import {LoginComponent} from '../components/login/login.component';
import {ResetPasswordComponent} from '../components/reset-password/reset-password.component';
import {AdminComponent} from '../components/admin/admin.component';
import {NewPasswordComponent} from '../components/new-password/new-password.component';
import {OrdersComponent} from '../components/admin/orders/orders.component';
import {UsersComponent} from '../components/admin/users/users.component';
import {OrdersResolverService} from '../route-resolvers/orders-resolver.service';
import {TablesComponent} from '../components/admin/tables/tables.component';
import {AddNewTableComponent} from '../components/admin/tables/add-new-table/add-new-table.component';
import {EditTableComponent} from '../components/admin/tables/edit-table/edit-table.component';
import {PageNotFoundComponent} from '../components/page-not-found/page-not-found.component';
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
import {UserAccountsResolverService} from '../route-resolvers/user-accounts-resolver.service';
import {AddNewUserComponent} from '../components/admin/users/add-new-user/add-new-user.component';
import {UserDetailsComponent} from '../components/admin/users/user-details/user-details.component';
import {EditUserComponent} from '../components/admin/users/edit-user/edit-user.component';
import {RolesResolverService} from '../route-resolvers/roles-resolver.service';
import {ChangePasswordByAdminComponent} from '../components/admin/users/change-password-by-admin/change-password-by-admin.component';
import {SettingsComponent} from '../components/admin/settings/settings.component';
import {SettingListComponent} from '../components/admin/settings/setting-list/setting-list.component';
import {SettingResolverService} from '../route-resolvers/setting-resolver.service';
import {EditSettingComponent} from '../components/admin/settings/edit-setting/edit-setting.component';
import {RemoveInventoryQuantityComponent} from '../components/admin/inventories/remove-inventory-quantity/remove-inventory-quantity.component';
import {TableResolverService} from '../route-resolvers/table-resolver.service';
import {UserAccountResolverService} from '../route-resolvers/user-account-resolver.service';
import {OrderResolverService} from '../route-resolvers/order-resolver.service';
import {FoodItemResolverService} from '../route-resolvers/food-item-resolver.service';
import {InventoryResolverService} from '../route-resolvers/inventory-resolver.service';


const appRoutes: Routes = [

  {
    path: 'pos',
    component: PointOfSaleComponent,
    canActivate: [AuthGuard],
    children:
    [
      {
        path: '',
        redirectTo: 'select-table',
        pathMatch: 'full'
      },
      {
        path: 'select-table',
        component: SelectTableComponent,
        resolve:
          {
            tables: TablesResolverService
          }
      },
      {
        path: ':table-id/menu',
        component: MenuComponent,
        resolve:
          {
            table: TableResolverService,
            foodItems: FoodItemsResolverService,
            inventories: InventoriesResolverService,
            setting: SettingResolverService
          }
      },
      {
        path: ':table-id/payment',
        component: PaymentComponent,
        resolve:
          {
            table: TableResolverService,
            setting: SettingResolverService,
            foodItems: FoodItemsResolverService
          }
      }
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
                    foodItems: FoodItemsResolverService
                  }
              },
              {
                path: 'add-new-food-item',
                component: AddNewFoodItemComponent,
                resolve:
                  {
                    foodItems: FoodItemsResolverService,
                    inventories: InventoriesResolverService
                  }
              },
              {
                path: ':food-item-id',
                component: FoodItemDetailsComponent,
                resolve:
                  {
                    foodItem: FoodItemResolverService,
                    inventories: InventoriesResolverService
                  }
              },
              {
                path: ':food-item-id/edit-food-item',
                component: EditFoodItemComponent,
                resolve:
                  {
                    foodItem: FoodItemResolverService,
                    inventories: InventoriesResolverService
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
                    inventories: InventoriesResolverService
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
                    inventory: InventoryResolverService
                  }
              },
              {
                path: ':inventory-id/edit-inventory-item',
                component: EditInventoryItemComponent,
                resolve:
                  {
                    inventory: InventoryResolverService
                  }
              },
              {
                path: ':inventory-id/update-inventory-quantity',
                component: UpdateInventoryItemComponent,
                resolve:
                  {
                    inventory: InventoryResolverService
                  }
              },
              {
                path: ':inventory-id/remove-inventory-quantity',
                component: RemoveInventoryQuantityComponent,
                resolve:
                  {
                    inventory: InventoryResolverService
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
                    orders: OrdersResolverService,
                    tables: TablesResolverService
                  }
              },
              {
                path: ':order-id',
                component: OrderDetailsComponent,
                resolve:
                  {
                    order: OrderResolverService,
                    tables: TablesResolverService,
                    foodItems: FoodItemsResolverService,
                    setting: SettingResolverService
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
                    tables: TablesResolverService
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
                    table: TableResolverService
                  }
              },
              {
                path: ':table-id/edit-table',
                component: EditTableComponent,
                resolve:
                  {
                    table: TableResolverService
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
                    userAccounts: UserAccountsResolverService
                  }
              },
              {
                path: 'add-new-user-account',
                component: AddNewUserComponent,
                resolve:
                  {
                    roles: RolesResolverService
                  }
              },
              {
                path: ':user-account-id',
                component: UserDetailsComponent,
                resolve:
                  {
                    userAccount: UserAccountResolverService
                  }
              },
              {
                path: ':user-account-id/edit-user-account',
                component: EditUserComponent,
                resolve:
                  {
                    roles: RolesResolverService,
                    userAccount: UserAccountResolverService
                  }
              },
              {
                path: ':user-account-id/change-password-by-admin',
                component: ChangePasswordByAdminComponent,
                resolve:
                  {
                    userAccount: UserAccountResolverService
                  }
              }
            ]
        },

        {
          path: 'settings',
          component: SettingsComponent,
          children:
           [
             {
               path: '',
               component: SettingListComponent,
               resolve:
                 {
                   settings: SettingResolverService
                 }
             },
             {
               path: 'setting-list',
               component: SettingListComponent,
               resolve:
                 {
                   settings: SettingResolverService
                 }
             },
             {
               path: 'edit-setting',
               component: EditSettingComponent,
               resolve:
                 {
                   settings: SettingResolverService
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
