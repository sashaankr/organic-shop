import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { environment } from 'src/environments/environment';
import { AdminAuthGuardService } from './admin-auth-guard.service';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BsNavbarComponent } from './bs-navbar/bs-navbar.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { ProductFilterComponent } from './products/product-filter/product-filter.component';
import { ProductsComponent } from './products/products.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { ShoppingCartSummaryComponent } from './shopping-cart-summary/shopping-cart-summary.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    BsNavbarComponent,
    HomeComponent,
    ProductsComponent,
    ShoppingCartComponent,
    CheckOutComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    ProductFormComponent,
    ProductFilterComponent,
    ShoppingCartSummaryComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    OrderModule,
    NgxPaginationModule,
    RouterModule.forRoot([
      { path: '', component: ProductsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'shopping-cart', component: ShoppingCartComponent },
      { path: 'login', component: LoginComponent },

      {
        path: 'check-out',
        component: CheckOutComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'order-success/:id',
        component: OrderSuccessComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'my/orders',
        component: MyOrdersComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: 'admin/products/new',
        component: ProductFormComponent,
        canActivate: [AuthGuardService, AdminAuthGuardService],
      },
      {
        path: 'admin/products/:id',
        component: ProductFormComponent,
        canActivate: [AuthGuardService, AdminAuthGuardService],
      },
      {
        path: 'admin/products',
        component: AdminProductsComponent,
        canActivate: [AuthGuardService, AdminAuthGuardService],
      },
      {
        path: 'admin/orders',
        component: AdminOrdersComponent,
        canActivate: [AuthGuardService, AdminAuthGuardService],
      },
    ]),
    NgbModule,
  ],
  providers: [AdminAuthGuardService],
  bootstrap: [AppComponent],
})
export class AppModule {}
