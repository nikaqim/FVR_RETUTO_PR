import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {  

  setData(key:string, value: string) {
      localStorage.setItem(key, value);
  }

  getData(key:string): string {
      return localStorage.getItem(key) || '';
  }
}
