import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { OrderItem } from '../../../shared/models/item';
import { Product } from '../../../shared/models/product';
import { ShoppingCart } from '../../../shared/models/shopping-cart';
import { OrderService } from '../../../shared/services/order.service';
import { ShoppingCartService } from '../../../shared/services/shopping-cart.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css'],
})
export class CheckOutComponent implements OnInit, OnDestroy {
  shipping: any = {};
  userId: string;
  userSubscription: Subscription;
  cart: ShoppingCart;
  cartSubscription: Subscription;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    let cart$ = await this.shoppingCartService.getCart();
    this.cartSubscription = cart$.subscribe((cart) => (this.cart = cart));
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
    this.cartSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
