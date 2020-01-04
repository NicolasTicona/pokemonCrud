import { PokemonService } from './../../services/pokemon.service';
import { ModalComponent } from './../modal/modal.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatSnackBar } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit{

  
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  pokemons: any = [];
  currentPokemonEdit: any;

  loading: boolean = false;
  max: number;

  listData: MatTableDataSource<any>
  displayedColumns: string[] = ["Nombre", "Peso", "Experiencia", "Habilidad", "Acciones"]


  searchKey = '';
  
  constructor(
            public dialog: MatDialog, 
            private pokemonService: PokemonService,
            private snackBar: MatSnackBar
  ){ }

  ngOnInit() {
    this.loading = true;

    this.pokemonService.getPokemonsAPI().subscribe(data => {
        this.listarPokemons(data)
    })
  }
  

  listarPokemons(data){
    let lista_pokemons = data.results;
    
    let lista = [];
    
    for(let i of lista_pokemons){
      // Regresa Observables
      let obs_poke = this.pokemonService.getPokemonAPI(i.url)  
      lista.push(obs_poke)
    }

    // Enviamos todas las promesas o observables al forkJoin para devolver una sola emision
    forkJoin(lista).subscribe(resultado => {
        for (const pokemon of resultado) {
          this.pokemonService.addPokemon(pokemon)
        }

        this.loading = false;
        this.updateDataSource()
      })
  }


  openDialog(element?){
    this.currentPokemonEdit = element;
    this.buildDialog(this.currentPokemonEdit)
  }

  buildDialog(data?){

    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        pokemon: data?data:{}
      }
    })
   
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.openSnackBar('El pokemon ha sido guardado')
        this.updateDataSource()
      }
    })
  }
  
  deletePokemon(element){
    this.pokemonService.deletePokemon(element)
    this.updateDataSource()
    this.openSnackBar('El pokemon ha sido eliminado')
  }

  updateDataSource(){
    this.pokemons = this.pokemonService.pokemonsJSON;
    this.max = this.pokemonService.pokemonsJSON.length;
    
    this.listData = new MatTableDataSource(this.pokemons);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
  }

  onApplyFilter(){
    this.listData.filter = this.searchKey.toLocaleLowerCase()
  }

  openSnackBar(message){
    this.snackBar.open(message)
  }

}
