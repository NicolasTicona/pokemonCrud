import { TableComponent } from './../../components/table/table.component';
import { HomeComponent } from './../../components/home/home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'data', component: TableComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
