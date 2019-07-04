import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface ILocalStorage {
  select(key: string, defaultValue: any): Observable<any>;
  set(key: string, value: any): void;
  remove(key: string): void;
}

@Injectable({
  providedIn: 'root'
})

export class StorageService implements ILocalStorage{

  protected subjects: {[key: string]: BehaviorSubject<any>} = {};

  select(key: string, defaultValue: any = null): Observable<any> {

    if (this.subjects.hasOwnProperty(key)) {
      return this.subjects[key];
    }

    if (!window.localStorage.getItem(key) && defaultValue) {
      window.localStorage.setItem(key, JSON.stringify(defaultValue));
    }

    const value = window.localStorage.getItem(key)
      ? JSON.parse(window.localStorage.getItem(key))
      : defaultValue;
    console.log('Received key %s, value %o', key, value);

    return this.subjects[key] = new BehaviorSubject(value);
  }

  set(key: string, value: any): void {

     console.log("StorageService: Stored key %s, value %o.", key, value);
    window.localStorage.setItem(key, JSON.stringify(value));

    if (this.subjects.hasOwnProperty(key)) {
      this.subjects[key].next(value);
    }
  }

  remove(key: string): void {

    window.localStorage.removeItem(key);

    if (this.subjects.hasOwnProperty(key)) {
      this.subjects[key].next(null);
    }
  }
}
