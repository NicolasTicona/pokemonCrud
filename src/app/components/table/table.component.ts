import { PokemonService } from './../../services/pokemon.service';
import { ModalComponent } from './../modal/modal.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { map } from 'rxjs/operators';
import { from, of } from 'rxjs';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  pokemons: any = [];

  aux = [
    {
      nombre: 'nicolas',
      peso: 12,
      experiencia: 12,
      habilidad: 'comer'
    }
  ]


  listData: MatTableDataSource<any>
  displayedColumns: string[] = ["Nombre", "Peso", "Experiencia", "Habilidad", "Acciones"]

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  searchKey = '';

  constructor(public dialog: MatDialog, private pokemonService: PokemonService) { }

  ngOnInit() {
    let dataApi;
    this.pokemonService.getPokemons()
      .subscribe(data => {
        dataApi = data;
        dataApi.results.forEach(element => {
          this.getPokemon(element.url)
        });
        
        this.listData = new MatTableDataSource(this.pokemons);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;

      })

  }

  getPokemon(url){
    this.pokemonService.getPokemon(url).subscribe(pokemon => {
      
      this.pokemons.push(pokemon)
    })
  }

  openDialog(){
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        mensaje: 'Modal works!'
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('Aceptado')
      }
    })
  }

  onApplyFilter(){
    this.listData.filter = this.searchKey.toLocaleLowerCase()
  }

}
