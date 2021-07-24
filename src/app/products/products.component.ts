import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { switchMap } from 'rxjs/operators';
import { ShoppingCartService } from '../shopping-cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  cart: any;
  subscription: Subscription

  category: string;

  constructor(productService: ProductService, route: ActivatedRoute, private shoppingCartService: ShoppingCartService) {
    productService.getAll().snapshotChanges().pipe(switchMap(products => {
      products.forEach((product) => {
        let newProduct = product as any
        this.products.push(this.buildProductObject(newProduct.payload.val().title,
          newProduct.payload.val().category,
          newProduct.payload.val().price,
          newProduct.payload.val().imageUrl,
          newProduct.key));
      });
      return route.queryParamMap;
    }))
      .subscribe(params => {
        this.category = params.get('category');
        this.filteredProducts = (this.category) ? this.products.filter(p => p.category === this.category) : this.products;
      });
  }

  async ngOnInit() {
    this.subscription =
      (await this.shoppingCartService.getCart())
        .subscribe(cart => this.cart = cart);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  buildProductObject(title, category, price, imageUrl, key) {
    let product = new Product()
    product.title = title
    product.category = category
    product.price = price
    product.imageUrl = imageUrl
    product.key = key
    return product
  }



}
