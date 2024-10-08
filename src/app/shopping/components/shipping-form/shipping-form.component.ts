import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderItem } from 'src/app/shared/models/item';
import { Product } from 'src/app/shared/models/product';
import { ShoppingCart } from 'src/app/shared/models/shopping-cart';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrl: './shipping-form.component.css',
})
export class ShippingFormComponent implements OnInit, OnDestroy {
  @Input('cart') cart: ShoppingCart;
  shipping: any = {};
  userId: string;
  userSubscription: Subscription;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(
      (user) => (this.userId = user.uid)
    );
  }

  async placeOrder() {
    let order = {
      userId: this.userId,
      datePlaced: new Date().getTime(),
      shipping: this.shipping,
      items: this.buildOrderItems(),
    };
    let result = await this.orderService.placeOrder(order);
    this.router.navigate(['/order-success', result.key]);
  }

  buildOrderItems() {
    let items: OrderItem[] = [];
    this.cart.productIds.forEach((productId) => {
      let product = new Product();
      let item = new OrderItem();
      product.title = this.cart.items[productId].product.title;
      product.imageUrl = this.cart.items[productId].product.imageUrl;
      product.price = this.cart.items[productId].product.price;
      item.product = product;
      item.quantity = this.cart.items[productId].quantity;
      item.totalPrice =
        this.cart.items[productId].product.price *
        this.cart.items[productId].quantity;
      items.push(item);
    });
    return items;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
