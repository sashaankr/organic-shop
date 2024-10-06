import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/category.service';
import { ProductService } from 'src/app/product.service';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  categories$;
  product: any = {};
  id;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.categories$ = categoryService.getCategories();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id)
      this.productService
        .get(this.id)
        .valueChanges()
        .pipe(take(1))
        .subscribe((p) => (this.product = p));
  }

  save(product) {
    if (this.id) this.productService.update(this.id, product);
    else this.productService.create(product);
    this.router.navigate(['/admin/products']);
  }

  delete() {
    this.productService.delete(this.id);
    this.router.navigate(['/admin/products']);
  }

  ngOnInit(): void {}

  open(content) {
    this.modalService.open(content, { centered: true }).result.then(
      (result) => {
        if (result != 'Yes') return;
        this.delete();
      },
      (reason) => {}
    );
  }
}
