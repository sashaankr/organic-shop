import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: any[] = [];
  items: Product[] = [];
  subscription: Subscription;
  itemCount: number;
  p: number;
  itemsPerPage: number = 5;

  constructor(private productService: ProductService) {
    this.subscription = this.productService
      .getAll()
      .snapshotChanges()
      .subscribe((products) => {
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
        this.filteredProducts = this.products;
      });
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

  filter(query: string) {
    this.filteredProducts = query
      ? this.products.filter((p) =>
          p.title.toLowerCase().includes(query.toLowerCase())
        )
      : this.products;
  }

  ngOnInit(): void {}

  key: string = '';
  reverse: boolean = false;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
