import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './modules/app-routing.module';
import {PointOfSaleService} from './services/point-of-sale.service';
import {DataStorageService} from './services/data-storage.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import { OrderPipe } from './pipes/order.pipe';
import {TableResolverService} from './route-resolvers/table-resolver.service';
import {OrderResolverService} from './route-resolvers/order-resolver.service';
import {InventoryResolverService} from './route-resolvers/inventory-resolver.service';
import {FoodItemResolverService} from './route-resolvers/food-item-resolver.service';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './auth/auth.guard';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './auth/auth.interceptor';
import {RoleResolverService} from './route-resolvers/role-resolver';
import {ModifiedUserResolverService} from './route-resolvers/modified-user-resolver.service';
import { UserFilterPipe } from './pipes/user-filter.pipe';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {NgProgressHttpModule} from '@ngx-progressbar/http';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgProgressRouterModule} from '@ngx-progressbar/router';
import {AppMaterialModule} from './modules/app-material.module';
import {PointOfSaleComponent} from './components/point-of-sale/point-of-sale.component';
import {AdminComponent} from './components/admin/admin.component';
import {RegisterComponent} from './components/admin/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {PaymentComponent} from './components/point-of-sale/payment/payment.component';
import {ReceiptComponent} from './components/point-of-sale/receipt/receipt.component';
import {TablesComponent} from './components/admin/tables/tables.component';
import {AddNewTableComponent} from './components/admin/tables/add-new-table/add-new-table.component';
import {OrdersComponent} from './components/admin/orders/orders.component';
import {EditTableComponent} from './components/admin/tables/edit-table/edit-table.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {NewPasswordComponent} from './components/new-password/new-password.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {ForbiddenComponent} from './components/forbidden/forbidden.component';
import {HeaderComponent} from './components/header/header.component';
import {InventoriesComponent} from './components/admin/inventories/inventories.component';
import {EditFoodItemComponent} from './components/admin/food-items/edit-food-item/edit-food-item.component';
import {EditInventoryItemComponent} from './components/admin/inventories/edit-inventory-item/edit-inventory-item.component';
import {AddNewFoodItemComponent} from './components/admin/food-items/add-new-food-item/add-new-food-item.component';
import {MenuComponent} from './components/point-of-sale/menu/menu.component';
import { SelectTableComponent } from './components/point-of-sale/select-table/select-table.component';
import { TableListComponent } from './components/admin/tables/table-list/table-list.component';
import { TableDetailsComponent } from './components/admin/tables/table-list/table-details/table-details.component';
import {OrderListComponent} from './components/admin/orders/order-list/order-list.component';
import {InventoryListComponent} from './components/admin/inventories/inventory-list/inventory-list.component';
import {InventoryDetailsComponent} from './components/admin/inventories/inventory-list/inventory-details/inventory-details.component';
import {UpdateInventoryItemComponent} from './components/admin/inventories/update-inventory-item/update-inventory-item.component';
import {AddFoodItemImageComponent} from './components/admin/food-items/add-food-item-image/add-food-item-image.component';
import {EditFoodItemImageComponent} from './components/admin/food-items/edit-food-item-image/edit-food-item-image.component';
import {OrderDetailsComponent} from './components/admin/orders/order-list/order-details/order-details.component';
import {FoodItemDetailsComponent} from './components/admin/food-items/food-item-list/food-item-details/food-item-details.component';
import {FoodItemListComponent} from './components/admin/food-items/food-item-list/food-item-list.component';
import {AddNewInventoryItemComponent} from './components/admin/inventories/add-new-inventory-item/add-new-inventory-item.component';
import {SessionComponent} from './components/point-of-sale/session/session.component';
import {FoodItemsComponent} from './components/admin/food-items/food-items.component';




@NgModule({
  declarations: [
    AppComponent,
    PointOfSaleComponent,
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    InventoriesComponent,
    MenuComponent,
    MenuComponent,
    AddNewFoodItemComponent,
    EditFoodItemComponent,
    EditInventoryItemComponent,
    FilterPipe,
    PaymentComponent,
    ReceiptComponent,
    TablesComponent,
    AddNewTableComponent,
    AddNewInventoryItemComponent,
    OrdersComponent,
    OrderListComponent,
    OrderDetailsComponent,
    OrderPipe,
    FoodItemsComponent,
    FoodItemListComponent,
    FoodItemDetailsComponent,
    InventoryListComponent,
    InventoryDetailsComponent,
    UpdateInventoryItemComponent,
    EditTableComponent,
    PageNotFoundComponent,
    ForbiddenComponent,
    ResetPasswordComponent,
    NewPasswordComponent,
    AddFoodItemImageComponent,
    EditFoodItemImageComponent,
    UserFilterPipe,
    HeaderComponent,
    SelectTableComponent,
    TableListComponent,
    TableDetailsComponent,
    SessionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    HttpClientModule,
    NgProgressHttpModule,
    NgProgressRouterModule,
    NgProgressModule.withConfig({
      color: '#6a7ce6',
      min: 20,
      spinner: false,
      meteor: false
    })
  ],

  providers: [
    PointOfSaleService,
    DataStorageService,
    TableResolverService,
    OrderResolverService,
    InventoryResolverService,
    FoodItemResolverService,
    RoleResolverService,
    ModifiedUserResolverService,
    AuthService,
    AuthGuard,
    {
      provide : HTTP_INTERCEPTORS,
      useClass : AuthInterceptor,
      multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
