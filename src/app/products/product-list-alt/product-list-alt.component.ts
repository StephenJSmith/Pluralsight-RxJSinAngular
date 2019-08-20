import { Component, ChangeDetectionStrategy } from '@angular/core';

import { EMPTY, Subject, combineLatest } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  products$ = this.productService.productsWithCategory$
  .pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);

      return EMPTY;
    })
  );

  selectedProduct$ = this.productService.selectedProduct$;

  vm$ = combineLatest([
    this.products$,
    this.selectedProduct$
  ]).pipe(
    map(([products, product]) =>
    ({products, productId: product ? product.id : 0}))
  );

  constructor(private productService: ProductService) { }

  onSelected(productId: string): void {
    this.productService.selectedProductChanged(+productId);
  }
}
