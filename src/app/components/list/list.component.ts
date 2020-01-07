import { SnackbarComponent } from './../../shared/snackbar.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './../modal/modal.component';
import { forkJoin } from 'rxjs';
import { PokemonService } from './../../services/pokemon.service';
import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  loading: boolean = false;
  noresults: boolean = false;
  pokemons: any;
  currentPokemonEdit: any;

  constructor(
              public dialog: MatDialog, 
              private pokemonService: PokemonService,
              private snackBar: MatSnackBar

  ) { }

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
          this.updatePokemons()
        })
    }else {
      this.noresults = true;
      this.loading = false;
    }
  }

  // Datasource
  updatePokemons(){
    if(this.pokemonService.pokemonsJSON.length > 0){

      this.noresults = false;
      this.pokemons = this.pokemonService.pokemonsJSON;
    }

    else{
      this.noresults = true;
      this.pokemons = []
    }
  }

  
  openBuildDialog(element?){
    this.currentPokemonEdit = element;
    this.buildDialog(this.currentPokemonEdit)
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
        this.updatePokemons()
      }
    })
  }

  deletePokemon(element){
    this.pokemonService.deletePokemon(element)
    this.pokemons = this.pokemonService.pokemonsJSON;
    this.pokemonService.deleteMyPokemonOfStorage(element)
    this.updatePokemons()
    this.openSnackBar('El pokemon ha sido eliminado')
  }

  openSnackBar(message){
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message
    })
  }


}
