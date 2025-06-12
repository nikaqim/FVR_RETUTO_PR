import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public setData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getData(key: string): string {
    return localStorage.getItem(key) || '';
  }
}
