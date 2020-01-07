import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class FilterService {


  keyFilter = new BehaviorSubject("");
  currentMessage = this.keyFilter.asObservable()

  constructor() { }

  updateKey(key){
    this.keyFilter.next(key);
  }
}
