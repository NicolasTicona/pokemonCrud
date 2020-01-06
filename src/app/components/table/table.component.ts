import { DetailsComponent } from './../details/details.component';
import { SnackbarComponent } from './../../shared/snackbar.component';
import { PokemonService } from './../../services/pokemon.service';
import { ModalComponent } from './../modal/modal.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatSnackBar } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ResumeStatPipe } from '../../pipes/resume-stat.pipe';


import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit{

  
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  pokemons: any = [];
  currentPokemonEdit: any;

  loading: boolean = false;
  max: number;
  noresults: boolean = false;

  listData: MatTableDataSource<any>
  displayedColumns: string[] = ["Nombre", "Peso", "Stats", "Experiencia", "Habilidad", "Acciones", "Equipo"]


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
    if(data.results){
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
    }else {
      this.noresults = true;
      this.loading = false;
    }
  }


  openBuildDialog(element?){
    this.currentPokemonEdit = element;
    this.buildDialog(this.currentPokemonEdit)
  }

  openBuildDialogDetails(element){
    this.buildDialogDetails(element)
  }


  // CREACION O EDICION DE POKEMON
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

  // DETALLES DE POKEMON
  buildDialogDetails(data){
    const dialogRef = this.dialog.open(DetailsComponent, {
      data: {
        pokemon: data?data:{}
      }
    })
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(resp => resp) 
   
  }
  
  deletePokemon(element){
    this.pokemonService.deletePokemon(element)
    this.pokemons = this.pokemonService.pokemonsJSON;
    this.pokemonService.deleteMyPokemonOfStorage(element)
    this.updateDataSource()
    this.openSnackBar('El pokemon ha sido eliminado')
  }

  updateDataSource(){
    if(this.pokemonService.pokemonsJSON.length > 0){

      this.noresults = false;
      this.displayedColumns = ["Nombre", "Peso", "Stats", "Experiencia", "Habilidad", "Acciones", "Equipo"]
      this.pokemons = this.pokemonService.pokemonsJSON;
      this.max = this.pokemonService.pokemonsJSON.length;
      
      this.listData = new MatTableDataSource(this.pokemons);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }

    else{
      this.noresults = true;
      this.listData = new MatTableDataSource();
      this.displayedColumns = []
    }
  }


  addToTeam(pokemon){
    let pokemons = JSON.parse(this.pokemonService.getMyTeamInStorage())
 
    if(pokemons != null){
      if(pokemons.length == 6){
        this.openSnackBar('Su equipo ya esta completo')
      }else{
        if(this.pokemonService.verifyTeamStorage(pokemon)){
          this.pokemonService.saveMyTeamInStorage(pokemon)
          this.openSnackBar(`${pokemon.nombre} ahora es de tu equipo!`)
        }else{
          this.openSnackBar('Pokemon ya elegido!')
        }
      }
    }else{
      this.pokemonService.saveMyTeamInStorage(pokemon);
      this.openSnackBar(`${pokemon.nombre} ahora es de tu equipo!`)
    }
  }

  onApplyFilter(){
    this.listData.filter = this.searchKey.toLocaleLowerCase()
  }

  openSnackBar(message){
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message
    })
  }

}
