import { Injectable } from '@angular/core';
import * as CryptoTS from 'crypto-ts';
import { CookieService } from 'ngx-cookie-service';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  TEMP = {
    KEY: '_tk',
    PASSWORD: '90590348534YYIU!@00'
  };
  USER = {
    KEY: '_tuL',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  constructor(
    private cookie: CookieService
  ) { }


  private encription(data: any, secret: string) {
    return CryptoTS.AES.encrypt(JSON.stringify(data), secret);
  }
  private decription(data: any, secret: string) {
    const bytes = CryptoTS.AES.decrypt(data.toString(), secret);
    return JSON.parse(bytes.toString(CryptoTS.enc.Utf8));
  }

  setTempData(data: any) {
    return this.cookie.set(this.TEMP.KEY, this.encription(data, this.TEMP.PASSWORD).toString());
  }
  getTempData() {
    const DATA = this.cookie.get(this.TEMP.KEY) !== null ? this.cookie.get(this.TEMP.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.TEMP.PASSWORD);
    } else {
      return undefined;
    }
  }
  clearTempData() {
    return this.cookie.delete(this.TEMP.KEY);
  }

  setUser(data: any) {
    return this.cookie.set(this.USER.KEY, this.encription(data, this.USER.PASSWORD).toString());
  }
  getUser() {
    const DATA = this.cookie.get(this.USER.KEY) !== null ? this.cookie.get(this.USER.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.USER.PASSWORD);
    } else {
      return undefined;
    }
  }

  clearUser() {
    return this.cookie.delete(this.USER.KEY);
  }

  // TOKEN
  getDataField(type: string) {
    if (this.getUser() !== undefined && this.getUser()[type] !== undefined) {
      return this.getUser()[type];
    } else {
      return undefined;
    }
  }

  setDataField(type: string, data: string | boolean) {
    const oldData = this.getUser();
    if (oldData !== undefined) {
      oldData[type] = data;
      this.setUser(oldData);
    }
  }


  isAuthenticate() {
    if (this.getDataField('isLogin')) {
      return true;
    } else {
      return false;
    }
  }

}
