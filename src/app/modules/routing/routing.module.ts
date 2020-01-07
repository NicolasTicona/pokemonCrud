import { ActionsComponent } from './../../components/actions/actions.component';
import { ListComponent } from './../../components/list/list.component';
import { PokemonsComponent } from './../../components/pokemons/pokemons.component';
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
      {path: 'test', component: ActionsComponent},
      {path: 'pokemons', component: PokemonsComponent, children: [
        {
          path: 'table', component: TableComponent
        },
        {
          path: 'list', component: ListComponent
        }
      ]}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
