import { ResolveFn } from '@angular/router';

import { catchError, of } from 'rxjs';
import { inject } from '@angular/core';
import { CartItem } from '../../shared/utils/interfaces';
import { CartService } from '../services/cart.service';

export const cartResolver: ResolveFn<CartItem[]> = (route, state) => {
  const cartService = inject(CartService);
  return cartService.fetchCartList().pipe(
    catchError((error) => {
      console.error('Error fetching product list:', error);
      return of([]);
    })
  );
};
