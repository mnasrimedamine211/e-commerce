import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  lastValueFrom,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../core/services/product.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { StateManagementService } from '../../shared/services/state-management.service';
import { CartItem, CartProduct, Product } from '../../shared/utils/interfaces';
import { apiUrl, carts } from '../../shared/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private loadingStates: {
    [key: string]: BehaviorSubject<boolean>;
  } = {};

  constructor(
    private http: HttpClient,
    private stateManagementService: StateManagementService,
    private productService: ProductService,
    private notification: NzNotificationService
  ) {}

  //#region Track Observable
  // Track unmodified carts list
  private rawCartListSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<
    CartItem[]
  >([]);
  get rawCartList$(): Observable<CartItem[]> {
    return this.rawCartListSubject.asObservable();
  }
  get rawCartList(): CartItem[] {
    return this.rawCartListSubject.value;
  }
  set rawCartList(data: CartItem[]) {
    this.rawCartListSubject.next(data);
  }

  // Track modified carts list

  private filteredCartListSubject: BehaviorSubject<CartItem[]> =
    new BehaviorSubject<CartItem[]>([]);
  get filteredCartList$(): Observable<CartItem[]> {
    return this.filteredCartListSubject.asObservable();
  }
  get filteredCartList(): CartItem[] {
    return this.filteredCartListSubject.value;
  }
  set filteredCartList(data: CartItem[]) {
    this.filteredCartListSubject.next(data);
  }

  // Track loading
  private getLoadingKey(cartId: number, action: string): string {
    return `${cartId}-${action}`;
  }
  // Get the loading state for a specific cart and action
  getLoadingState(cartId: number, action: string): Observable<boolean> {
    const key = this.getLoadingKey(cartId, action);
    if (!this.loadingStates[key]) {
      this.loadingStates[key] = new BehaviorSubject<boolean>(false);
    }
    return this.loadingStates[key].asObservable();
  }
  // Set the loading state for a specific cart and action
  setLoadingState(cartId: number, action: string, isLoading: boolean): void {
    const key = this.getLoadingKey(cartId, action);
    if (!this.loadingStates[key]) {
      this.loadingStates[key] = new BehaviorSubject<boolean>(isLoading);
    } else {
      this.loadingStates[key].next(isLoading);
    }
  }

  //#endregion

  //#region Api Cart
  // Fetch carts
  fetchCartList(): Observable<CartItem[]> {
    this.stateManagementService.loading = true;
    return this.http.get<CartItem[]>(`${apiUrl}${carts}`).pipe(
      switchMap((response: CartItem[]) => {
        this.rawCartList = response || [];
        this.filteredCartList = response || [];

        return of(response);
      }),
      catchError((error) => {
        this.rawCartList = [];
        this.filteredCartList = [];

        return of([]);
      }),
      finalize(() => {
        this.stateManagementService.loading = false;
      })
    );
  }

  //Added a new cart
  addCart(cart: CartItem): Observable<CartItem> {
    this.productService.setLoadingState(
      cart.products[0].productId,
      'added',
      true
    );
    return this.http.post<CartItem>(`${apiUrl}${carts}`, cart).pipe(
      switchMap((response: CartItem) => {
        this.rawCartList.unshift(cart);
        return of(cart);
      }),
      catchError((error) => {
        console.error('Error adding product to cart:', error);
        return of(cart);
      }),
      finalize(() => {
        this.productService.setLoadingState(
          cart.products[0].productId,
          'added',
          false
        );
        this.createNotification('Success added', `Cart added successfully`);
      })
    );
  }

  // update a cart by id
  updateCartById(cart: CartItem): Observable<CartItem> {
    return this.http.put<CartItem>(`${apiUrl}${carts}/${cart.id}`, cart).pipe(
      switchMap((response: CartItem) => {
        this.rawCartList = this.rawCartList.map((item: CartItem) => {
          if (item.id === cart.id) {
            return cart;
          }
          return item;
        });
        this.filteredCartList = this.filteredCartList.map((item: CartItem) => {
          if (item.id === cart.id) {
            return cart;
          }
          return item;
        });
        return of(cart);
      }),
      catchError((error) => {
        console.error('Error adding product to cart:', error);
        return of(cart);
      }),
      finalize(() => {})
    );
  }

  // Delete cart by id
  deleteCartById(cart: CartItem): Observable<CartItem[]> {
    this.setLoadingState(cart.id, 'deleted', true);
    return this.http.delete<CartItem>(`${apiUrl}${carts}/${cart.id}`).pipe(
      switchMap((response: CartItem) => {
        const list: CartItem[] = [];
        this.rawCartList.forEach((item: CartItem) => {
          if (item.id !== cart.id) {
            list.push(item);
          }
        });
        const filteredList: CartItem[] = [];
        this.filteredCartList.forEach((item: CartItem) => {
          if (item.id !== cart.id) {
            filteredList.push(item);
          }
        });
        this.rawCartList = list;
        this.filteredCartList = filteredList;
        return of(filteredList);
      }),
      catchError((error) => {
        console.error('Error adding product to cart:', error);
        return of(this.rawCartList);
      }),
      finalize(() => {
        this.setLoadingState(cart.id, '', false);
        this.createNotification('Success deleted', `Cart deleted successfully`);
      })
    );
  }

  //#endregion

  //#region  Utility Methods
  // Get price total of cart items
  getTotalPrice(): number {
    let priceTotal = 0;
    if (this.rawCartList.length === 0) return priceTotal;
    this.rawCartList.forEach((cart: CartItem) => {
      priceTotal = priceTotal + this.getCartPrice(cart);
    });
    return priceTotal;
  }
  // Get number of products in cart list
  getTotalItemCount(): number {
    return this.getProductsExistInCarts().length;
  }

  // Get cart price based on product price * quantity
  getCartPrice(item: CartItem): number {
    let price = 0;
    if (item.products.length === 0) return price;
    item.products.forEach((element: CartProduct) => {
      const product: Product | null = this.productService.getProductById(
        element.productId
      );
      if (product) {
        price = product.price * element.quantity;
      }
    });
    return price;
  }
  // Get cart quantity of cart item
  getCartQuantity(item: CartItem): number {
    let quantity = 0;
    if (item.products.length === 0) return quantity;
    item.products.forEach((product: CartProduct) => {
      quantity += product.quantity;
    });
    return quantity;
  }
  // Trest if product exist in cart list
  isProductInCart(productId: number): boolean {
    return !!this.rawCartList.find((item) =>
      item.products.some(
        (product: CartProduct) => product.productId === productId
      )
    );
  }

  // get products are not in carts list
  getProductsExistInCarts(): Product[] {
    return this.productService.rawProductList.filter((product: Product) =>
      this.isProductInCart(product.id)
    );
  }
  // get products are in carts list
  getProductsNotExistInCart(): Product[] {
    return this.productService.rawProductList.filter(
      (product: Product) => !this.isProductInCart(product.id)
    );
  }

  // update cart item
  updateCart(productIds: number[], cartId: number | null, isAdded: boolean) {
    const action = isAdded ? 'added' : 'removed';
    const cart: CartItem | undefined = this.rawCartList.find(
      (cart) => cart.id === cartId
    );
    if (cart && productIds.length > 0) {
      if (isAdded) {
        const cartProducts: CartProduct[] = cart.products;
        productIds.forEach((productId: number) => {
          const existingProduct = cartProducts.find(
            (product) => product.productId === productId
          );

          if (existingProduct) {
            existingProduct.quantity += 1;
          } else {
            cartProducts.push({ productId, quantity: 1 });
          }
        });
        cart.products = cartProducts;
      } else {
        cart.products = cart.products.filter(
          (product) => !productIds.includes(product.productId)
        );
      }
      this.setLoadingState(cart.id, action, true);
      this.updateCartById(cart).subscribe(() => {
        this.setLoadingState(cart.id, action, false);
        this.createNotification(
          'Success ' + action,
          `Cart ${action} products successfully`
        );
      });
    }
  }

  // Open notification modal
  createNotification(title: string, text: string): void {
    this.notification.blank(title, text).onClick.subscribe(() => {});
  }
  // Remove product from all carts and update the cart list
  async removeProductFromCarts(productId: number): Promise<void> {
    this.productService.setLoadingState(productId, 'removed', true);

    const cartsWithProduct = this.rawCartList.filter((cart) =>
      cart.products.some((product) => product.productId === productId)
    );

    for (const cart of cartsWithProduct) {
      cart.products = cart.products.filter(
        (product) => product.productId !== productId
      );
      await lastValueFrom(this.updateCartById(cart));
    }

    // Reset loading state after all updates are done
    this.productService.setLoadingState(productId, 'removed', false);
    this.createNotification(
      'Success removed',
      `Product removed from all carts successfully`
    );
  }

  //#endregion
}
