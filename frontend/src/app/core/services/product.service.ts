import { Injectable } from '@angular/core';
import { Product } from '../../shared/utils/interfaces';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiUrl, categories, products } from '../../shared/utils/utils';
import { StateManagementService } from '../../shared/services/state-management.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private loadingStates: {
    [key: string]: BehaviorSubject<boolean>;
  } = {};
  constructor(
    private stateManagementService: StateManagementService,
    private http: HttpClient
  ) {}

  //#region Track to observable
  // Track unmodified product list.
  private rawProductListSubject: BehaviorSubject<Product[]> =
    new BehaviorSubject<Product[]>([]);
  get rawProductList$(): Observable<Product[]> {
    return this.rawProductListSubject.asObservable();
  }
  get rawProductList(): Product[] {
    return this.rawProductListSubject.value;
  }
  set rawProductList(data: Product[]) {
    this.rawProductListSubject.next(data);
  }
  // Track filtered product list.
  private filteredProductListSubject: BehaviorSubject<Product[]> =
    new BehaviorSubject<Product[]>([]);
  get filteredProductList$(): Observable<Product[]> {
    return this.filteredProductListSubject.asObservable();
  }
  get filteredProductList(): Product[] {
    return this.filteredProductListSubject.value;
  }
  set filteredProductList(data: Product[]) {
    this.filteredProductListSubject.next(data);
  }

  // Track categories list
  private categoryListSubject: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  get categoryList$(): Observable<string[]> {
    return this.categoryListSubject.asObservable();
  }
  get categoryList(): string[] {
    return this.categoryListSubject.value;
  }
  set categoryList(data: string[]) {
    this.categoryListSubject.next(data);
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

  //#region API Methods
  fetchProductList(): Observable<Product[]> {
    this.stateManagementService.loading = true;
    return this.http.get<Product[]>(`${apiUrl}${products}`).pipe(
      switchMap((response: Product[]) => {
        this.rawProductList = response || [];
        this.filteredProductList = response || [];
        this.stateManagementService.loading = false;
        this.fetchCategoryList().subscribe();
        return of(response);
      }),
      catchError((error) => {
        this.rawProductList = [];
        this.filteredProductList = [];
        this.stateManagementService.loading = false;
        return of([]);
      })
    );
  }

  // get categories
  fetchCategoryList(): Observable<string[]> {
    return this.http.get<string[]>(`${apiUrl}${products}/${categories}`).pipe(
      switchMap((response: string[]) => {
        this.categoryList = response;
        console.log(response);
        return of(response);
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

  // Add a new product
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${apiUrl}${products}`, product).pipe(
      switchMap((response: Product) => {
        this.rawProductList.unshift(product);
        this.filteredProductList.unshift(product);
        return of(product);
      }),
      catchError((error) => {
        console.error('Error adding product to cart:', error);
        return of(product);
      })
    );
  }

  //#endregion

  //#region  Utility Methods
  // get product by id
  getProductById(id: number): Product | null {
    const product: Product | undefined = this.rawProductList.find(
      (item: Product) => item.id === id
    );
    return product || null;
  }

  // search on product by name or category
  onSearchProduct(event: any): void {
    const search = event.target.value || null;
    this.filteredProductList = !search
      ? this.rawProductList
      : this.rawProductList.filter(
          (product: Product) =>
            product.title
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()) ||
            product.category
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase())
        );
  }
  isAvailable(data: Product): boolean {
    return data.rating?.count > 0;
  }

  //#endregion
}
