import { isPlatformBrowser } from '@angular/common';
import { HostListener, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateManagementService {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.calculateTableHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculateTableHeight();
  }

  calculateTableHeight(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.tableHeight = window.innerHeight;
    }
  }
  //#region  Track Observable

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

  private heightTableSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  get tableHeight$(): Observable<number> {
    return this.heightTableSubject.asObservable();
  }
  get tableHeight(): number {
    return this.heightTableSubject.value;
  }
  set tableHeight(data: number) {
    this.heightTableSubject.next(data);
  }
  //#endregion
}
