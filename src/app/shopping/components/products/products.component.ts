import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/models/product';
import { ProductService } from '../../../shared/services/product.service';
import { switchMap } from 'rxjs/operators';
import { ShoppingCartService } from '../../../shared/services/shopping-cart.service';
import { Observable, Subscription } from 'rxjs';
import { ShoppingCart } from '../../../shared/models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  cart$: Observable<ShoppingCart>;

  category: string;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService
  ) {}

  async ngOnInit() {
    this.productService
      .getAll()
      .snapshotChanges()
      .pipe(
        switchMap((products) => {
          products.forEach((product) => {
            let newProduct = product as any;
            this.products.push(
              this.buildProductObject(
                newProduct.payload.val().title,
                newProduct.payload.val().category,
                newProduct.payload.val().price,
                newProduct.payload.val().imageUrl,
                newProduct.key
              )
            );
          });
          return this.route.queryParamMap;
        })
      )
      .subscribe((params) => {
        this.category = params.get('category');
        this.filteredProducts = this.category
          ? this.products.filter((p) => p.category === this.category)
          : this.products;
      });
    this.cart$ = await this.shoppingCartService.getCart();
  }

  buildProductObject(title, category, price, imageUrl, key) {
    let product = new Product();
    product.title = title;
    product.category = category;
    product.price = price;
    product.imageUrl = imageUrl;
    product.key = key;
    return product;
  }
}
