import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { Product } from '../models/product';
import { map, take } from 'rxjs/operators';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  constructor(private db: AngularFireDatabase) {}

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    let fireBaseCart = this.db.object(
      '/shopping-carts/' + cartId
    ) as AngularFireObject<ShoppingCart>;
    return fireBaseCart.valueChanges().pipe(
      map((x) => {
        if (x == null) return new ShoppingCart(0);
        return new ShoppingCart(x.items);
      })
    );
  }

  async addToCart(product: Product) {
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.key);
    item$
      .valueChanges()
      .pipe(take(1))
      .subscribe((item) => {
        if (item == null) item$.set({ product: product, quantity: 1 });
        else item$.update({ quantity: item.quantity + 1 });
      });
  }

  async removeFromCart(product: Product) {
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.key);
    item$
      .valueChanges()
      .pipe(take(1))
      .subscribe((item) => {
        item$.update({ quantity: item.quantity - 1 });
        if (item.quantity === 1) item$.remove();
      });
  }

  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime(),
    });
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object(
      '/shopping-carts/' + cartId + '/items/' + productId
    ) as any;
  }

  private async getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;
    let result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }
}
