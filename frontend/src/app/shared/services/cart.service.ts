import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Product } from '../utils/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor() {}

  //#region Track Observable
  private cartListSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<
    CartItem[]
  >([]);
  get cartList$(): Observable<CartItem[]> {
    return this.cartListSubject.asObservable();
  }
  get cartList(): CartItem[] {
    return this.cartListSubject.value;
  }
  set cartList(data: CartItem[]) {
    this.cartListSubject.next(data);
  }

  addToCart(product: Product): void {
    const existingItem = this.cartList.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
      existingItem.price += product.price;
    } else {
      this.cartList.push({ ...product, quantity: 1 });
    }
    this.cartList = this.cartList;
  }

  removeFromCart(productId: number): void {
    const updatedItems = this.cartList.filter((item) => item.id !== productId);
    this.cartList = updatedItems;
  }

  getTotalPrice(): number {
    return this.cartList.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getTotalItemCount(): number {
    return this.cartList.reduce((count, item) => count + item.quantity, 0);
  }

  isProductInCart(productId: number): boolean {
    return !!this.cartList.find((item) => item.id === productId);
  }
}
