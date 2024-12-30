import { Injectable } from '@angular/core';
import { Product } from '../../shared/utils/interfaces';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiUrl, products } from '../../shared/utils/utils';
import { StateManagementService } from '../../shared/services/state-management.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
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
  //#endregion

  //#region API Methods
  fetchProductList(): Observable<Product[]> {
    this.stateManagementService.loading = true;
    return this.http.get<Product[]>(`${apiUrl}${products}`).pipe(
      switchMap((response: Product[]) => {
        this.rawProductList = response || [];
        this.filteredProductList = response || [];
        this.stateManagementService.loading = false;
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
  //#endregion
}
