import { Product } from './product';

export class ShoppingCart {
  constructor(public items: any) {}

  get productIds() {
    if (this.items == null || this.items == undefined) return [];
    else return Object.keys(this.items);
  }

  get totalItemsCount() {
    if (this.items == 0) return 0;
    let count = 0;
    for (let productId in this.items) {
      count += this.items[productId].quantity;
    }
    return count;
  }

  get totalPrice() {
    let sum = 0;
    for (let productId in this.items) {
      sum +=
        this.items[productId].product.price * this.items[productId].quantity;
    }
    return sum;
  }

  getQuantity(product: Product) {
    if (this.items == null || this.items == undefined) return 0;
    else {
      let item = this.items[product.key];
      return item ? item.quantity : 0;
    }
  }
}
