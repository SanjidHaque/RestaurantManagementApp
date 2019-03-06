import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OurOffersComponent } from './our-offers/our-offers.component';
import {AppRoutingModule} from './modules/app-routing.module';
import {OurOffersService} from './services/our-offers.service';
import {DataStorageService} from './services/data-storage.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { FoodItemsComponent } from './our-offers/food-items/food-items.component';
import { InventoryComponent } from './admin/inventory/inventory.component';
import { AddNewInventoryComponent } from './admin/inventory/add-new-inventory/add-new-inventory.component';
import { EditInventoryItemComponent } from './admin/inventory/edit-inventory-item/edit-inventory-item.component';
import { FoodItemComponent } from './admin/food-item/food-item.component';
import { AddNewFoodItemComponent } from './admin/food-item/add-new-food-item/add-new-food-item.component';
import { EditFoodItemComponent } from './admin/food-item/edit-food-item/edit-food-item.component';
import { FilterPipe } from './pipes/filter.pipe';
import { PaymentComponent } from './our-offers/payment/payment.component';
import { ReceiptComponent } from './our-offers/receipt/receipt.component';
import { TablesComponent } from './admin/tables/tables.component';
import { AddNewTableComponent } from './admin/tables/add-new-table/add-new-table.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { OrderListViewComponent } from './admin/orders/order-list-view/order-list-view.component';
import { OrderListViewDetailsComponent } from './admin/orders/order-list-view/order-list-view-details/order-list-view-details.component';
import { OrderGridViewComponent } from './admin/orders/order-grid-view/order-grid-view.component';
import { OrderGridViewDetailsComponent } from './admin/orders/order-grid-view/order-grid-view-details/order-grid-view-details.component';
import { OrderPipe } from './pipes/order.pipe';
import {FooditemListViewComponent} from './admin/food-item/fooditem-list-view/fooditem-list-view.component';
import {FooditemGridViewComponent} from './admin/food-item/fooditem-grid-view/fooditem-grid-view.component';
import {ListDetailsComponent} from './admin/food-item/fooditem-list-view/list-details/list-details.component';
import {GridDetailsComponent} from './admin/food-item/fooditem-grid-view/grid-details/grid-details.component';
import { InventoryListViewComponent } from './admin/inventory/inventory-list-view/inventory-list-view.component';
import { InventoryGridViewComponent } from './admin/inventory/inventory-grid-view/inventory-grid-view.component';
import { InventoryListDetailsComponent } from './admin/inventory/inventory-list-view/inventory-list-details/inventory-list-details.component';
import { InventoryGridDetailsComponent } from './admin/inventory/inventory-grid-view/inventory-grid-details/inventory-grid-details.component';
import { UpdateInventoryItemComponent } from './admin/inventory/update-inventory-item/update-inventory-item.component';
import { EditTableComponent } from './admin/tables/edit-table/edit-table.component';
import {TableResolverService} from './route-resolvers/table-resolver.service';
import {OrderResolverService} from './route-resolvers/order-resolver.service';
import {InventoryResolverService} from './route-resolvers/inventory-resolver.service';
import {FoodItemResolverService} from './route-resolvers/food-item-resolver.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {UserService} from './services/user.service';
import { LogoutComponent } from './logout/logout.component';
import {AuthGuard} from './auth/auth.guard';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './auth/auth.interceptor';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import {RoleResolverService} from './route-resolvers/role-resolver';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import {ModifiedUserResolverService} from './route-resolvers/modified-user-resolver.service';
import { AddFoodItemImageComponent } from './admin/food-item/add-food-item-image/add-food-item-image.component';
import { EditFoodItemImageComponent } from './admin/food-item/edit-food-item-image/edit-food-item-image.component';
import { UserFilterPipe } from './pipes/user-filter.pipe';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {NgProgressHttpModule} from '@ngx-progressbar/http';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgProgressRouterModule} from '@ngx-progressbar/router';




@NgModule({
  declarations: [
    AppComponent,
    OurOffersComponent,
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
    OrderGridViewComponent,
    OrderGridViewDetailsComponent,
    OrderPipe,
    FooditemListViewComponent,
    FooditemGridViewComponent,
    ListDetailsComponent,
    GridDetailsComponent,
    InventoryListViewComponent,
    InventoryGridViewComponent,
    InventoryListDetailsComponent,
    InventoryGridDetailsComponent,
    UpdateInventoryItemComponent,
    EditTableComponent,
    PageNotFoundComponent,
    LogoutComponent,
    ForbiddenComponent,
    ResetPasswordComponent,
    NewPasswordComponent,
    AddFoodItemImageComponent,
    EditFoodItemImageComponent,
    UserFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    HttpClientModule,
    NgProgressHttpModule,
    NgProgressRouterModule,
    NgProgressModule.withConfig({
      color: '#7e0000',
      min: 20,
      spinner: false,
      meteor: false
    })
  ],

  providers: [
    OurOffersService,
    DataStorageService,
    TableResolverService,
    OrderResolverService,
    InventoryResolverService,
    FoodItemResolverService,
    RoleResolverService,
    ModifiedUserResolverService,
    UserService,
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
