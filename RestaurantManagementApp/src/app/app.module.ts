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
import {InventoryComponent} from './components/admin/inventory/inventory.component';
import {AdminComponent} from './components/admin/admin.component';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {FoodItemsComponent} from './components/point-of-sale/food-items/food-items.component';
import {FoodItemComponent} from './components/admin/food-item/food-item.component';
import {AddNewFoodItemComponent} from './components/admin/food-item/add-new-food-item/add-new-food-item.component';
import {EditFoodItemComponent} from './components/admin/food-item/edit-food-item/edit-food-item.component';
import {EditInventoryItemComponent} from './components/admin/inventory/edit-inventory-item/edit-inventory-item.component';
import {PaymentComponent} from './components/point-of-sale/payment/payment.component';
import {ReceiptComponent} from './components/point-of-sale/receipt/receipt.component';
import {TablesComponent} from './components/admin/tables/tables.component';
import {AddNewTableComponent} from './components/admin/tables/add-new-table/add-new-table.component';
import {ControlPanelComponent} from './components/control-panel/control-panel.component';
import {AddNewInventoryComponent} from './components/admin/inventory/add-new-inventory/add-new-inventory.component';
import {OrderListViewComponent} from './components/admin/orders/order-list-view/order-list-view.component';
import {OrdersComponent} from './components/admin/orders/orders.component';
import {FooditemListViewComponent} from './components/admin/food-item/fooditem-list-view/fooditem-list-view.component';
import {OrderListViewDetailsComponent} from './components/admin/orders/order-list-view/order-list-view-details/order-list-view-details.component';
import {ListDetailsComponent} from './components/admin/food-item/fooditem-list-view/list-details/list-details.component';
import {InventoryListViewComponent} from './components/admin/inventory/inventory-list-view/inventory-list-view.component';
import {InventoryListDetailsComponent} from './components/admin/inventory/inventory-list-view/inventory-list-details/inventory-list-details.component';
import {UpdateInventoryItemComponent} from './components/admin/inventory/update-inventory-item/update-inventory-item.component';
import {EditTableComponent} from './components/admin/tables/edit-table/edit-table.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {AddFoodItemImageComponent} from './components/admin/food-item/add-food-item-image/add-food-item-image.component';
import {EditFoodItemImageComponent} from './components/admin/food-item/edit-food-item-image/edit-food-item-image.component';
import {NewPasswordComponent} from './components/new-password/new-password.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {ForbiddenComponent} from './components/forbidden/forbidden.component';
import {HeaderComponent} from './components/header/header.component';




@NgModule({
  declarations: [
    AppComponent,
    PointOfSaleComponent,
    LoginComponent,
    RegisterComponent,
    AdminComponent,
    InventoryComponent,
    FoodItemsComponent,
    FoodItemComponent,
    AddNewFoodItemComponent,
    EditFoodItemComponent,
    EditInventoryItemComponent,
    FilterPipe,
    PaymentComponent,
    ReceiptComponent,
    TablesComponent,
    AddNewTableComponent,
    ControlPanelComponent,
    AddNewInventoryComponent,
    OrdersComponent,
    OrderListViewComponent,
    OrderListViewDetailsComponent,
    OrderPipe,
    FooditemListViewComponent,
    ListDetailsComponent,
    InventoryListViewComponent,
    InventoryListDetailsComponent,
    UpdateInventoryItemComponent,
    EditTableComponent,
    PageNotFoundComponent,
    ForbiddenComponent,
    ResetPasswordComponent,
    NewPasswordComponent,
    AddFoodItemImageComponent,
    EditFoodItemImageComponent,
    UserFilterPipe,
    HeaderComponent
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
