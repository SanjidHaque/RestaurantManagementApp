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
import {RegistrationComponent} from '../components/admin/registration/registration.component';
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
import {OrderDetailsComponent} from '../components/admin/orders/order-list/order-details/order-details.component';
import {TableListComponent} from '../components/admin/tables/table-list/table-list.component';
import {FoodItemDetailsComponent} from '../components/admin/food-items/food-item-list/food-item-details/food-item-details.component';
import {FoodItemListComponent} from '../components/admin/food-items/food-item-list/food-item-list.component';
import {EditFoodItemComponent} from '../components/admin/food-items/edit-food-item/edit-food-item.component';
import {AddNewFoodItemComponent} from '../components/admin/food-items/add-new-food-item/add-new-food-item.component';
import {EditInventoryItemComponent} from '../components/admin/inventories/edit-inventory-item/edit-inventory-item.component';
import {AddNewInventoryItemComponent} from '../components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component';
import {TableDetailsComponent} from '../components/admin/tables/table-list/table-details/table-details.component';
import {UpdateInventoryItemComponent} from '../components/admin/inventories/update-inventory-item/update-inventory-item.component';


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
                path: ':foodItemId',
                component: FoodItemDetailsComponent,
                resolve:
                  {
                    foodItems: FoodItemResolverService
                  }
              },
              {
                path: ':foodItemId/edit-food-item',
                component: EditFoodItemComponent,
                resolve:
                  {
                    foodItems: FoodItemResolverService
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
                path: ':inventoryId',
                component: InventoryDetailsComponent,
                resolve:
                  {
                    inventories: InventoryResolverService
                  }
              },
              {
                path: ':inventoryId/edit-inventory-item',
                component: EditInventoryItemComponent,
                resolve:
                  {
                    inventories: InventoryResolverService
                  }
              },
              {
                path: ':inventoryId/update-inventory-item',
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
                children:
                  [
                    {
                      path: ':id',
                      component: OrderDetailsComponent
                    }
                  ]
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
                children:
                  [
                    {
                      path: ':id',
                      component: TableDetailsComponent
                    },
                    {
                      path: ':id/edit-table',
                      component: EditTableComponent
                    }
                  ]
              }
            ]
        },
        {
          path: 'registration',
          component: RegistrationComponent,
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
