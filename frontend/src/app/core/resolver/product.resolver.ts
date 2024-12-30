import { ResolveFn } from '@angular/router';
import { ProductService } from '../services/product.service';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const productResolver: ResolveFn<any> = (route, state) => {
  const productService = inject(ProductService);
  return productService.fetchProductList().pipe(
    catchError((error) => {
      console.error('Error fetching product list:', error);
      return of([]);
    })
  );
};
