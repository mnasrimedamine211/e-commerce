import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateManagementService {
  constructor() {}

  //#region  Track Observable
  // Track on search an article shared
  private searchSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  get search$(): Observable<string> {
    return this.searchSubject.asObservable();
  }
  get search(): string {
    return this.searchSubject.value;
  }
  set search(data: string) {
    this.searchSubject.next(data);
  }

  // loading track
  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
  get loading(): boolean {
    return this.loadingSubject.value;
  }
  set loading(data: boolean) {
    this.loadingSubject.next(data);
  }
  //#endregion
}
