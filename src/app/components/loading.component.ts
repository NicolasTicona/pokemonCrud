import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
styles: [`      

  :host{
    display: flex;
    align-items:center;
    justify-content: center;
    min-height: 50vh;
  }
`],
  template: `
      <mat-progress-spinner
        color="primary"
        mode="indeterminate">
      </mat-progress-spinner>

  `
})
export class LoadingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
