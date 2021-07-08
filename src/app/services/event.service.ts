import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private storage: StorageService
  ) { }

  private Loading = new BehaviorSubject(true);
  isLoading = this.Loading.asObservable();
  private customLoading = new BehaviorSubject(false);
  isCustomLoading = this.customLoading.asObservable();
  private Login = new BehaviorSubject(this.storage.isAuthenticate());
  isLogin = this.Login.asObservable();

  isHttpRequest = new Subject<boolean>();

  setLoginEmmit(isLogin: boolean) {
    return this.Login.next(isLogin);
  }
  setLoaderEmmit(isLoading: boolean) {
    return this.Loading.next(isLoading);
  }
  setCustomLoaderEmmit(res: boolean) {
    return this.customLoading.next(res);
  }
}
