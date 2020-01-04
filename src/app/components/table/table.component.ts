import { PokemonService } from './../../services/pokemon.service';
import { ModalComponent } from './../modal/modal.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { map } from 'rxjs/operators';
import { from, of, forkJoin } from 'rxjs';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit{

  
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  pokemons: any = [];
  currentPokemonEdit: any;
  loading: boolean = false;

  max: number;

  listData: MatTableDataSource<any>
  displayedColumns: string[] = ["Nombre", "Peso", "Experiencia", "Habilidad", "Acciones"]


  searchKey = '';
  

  constructor(public dialog: MatDialog, private pokemonService: PokemonService) { 

  }

  ngOnInit() {
    this.loading = true;
    this.pokemonService.getPokemonsAPI().subscribe(result => {
        this.listarPokemons(result)

      })
  }
  

  listarPokemons(data){
    let lista_pokemons = data.results;
    let poke_lista = [];
    
    for(let i of lista_pokemons){
      let obs_poke = this.pokemonService.getPokemonAPI(i.url)  
      poke_lista.push(obs_poke)
    }

    // Enviamos todas las promesas o observables al forkJoin para devolver una sola emision
    forkJoin(poke_lista).subscribe(resultado => {
      for (const pokemon of resultado) {
        this.pokemonService.addPokemon(pokemon)
      }
        this.loading = false;
        this.updateDataSource()
      })
  }


  openDialog(element?){
    this.currentPokemonEdit = element;
    this.onOpenDialog(this.currentPokemonEdit)
  }

  onOpenDialog(data?){
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        pokemon: data?data:{}
      }
    })
   
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result)
        this.updateDataSource()
      }
    })
  }

  updateDataSource(){
    
    this.pokemons = this.pokemonService.pokemonsJSON;
    this.max = this.pokemonService.pokemonsJSON.length;
    this.listData = new MatTableDataSource(this.pokemons);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
  }

  deletePokemon(element){
    this.pokemonService.deletePokemon(element)
    this.updateDataSource()
  }

  onApplyFilter(){
    this.listData.filter = this.searchKey.toLocaleLowerCase()
  }

}
