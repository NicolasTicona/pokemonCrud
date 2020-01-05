import { MatSnackBar } from '@angular/material';
import { PokemonService } from './../../services/pokemon.service';
import { Component, OnInit } from '@angular/core';
import { SnackbarComponent } from 'src/app/shared/snackbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pokemons: any[] = [];
  noteam: boolean = false;

  constructor(
              private pokemonService: PokemonService,
              private snackBar: MatSnackBar
              ) { }

  ngOnInit() {
    this.updateTeam()
  }

  removePokemon(pokemon){
    this.pokemonService.deletePokemonInStorage(pokemon)
    this.openSnackBar(`${pokemon.nombre} ha sido removido de tu equipo`)
    this.updateTeam()
  }

  openSnackBar(message){
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message
    })
  }

  updateTeam(){
    if(!this.pokemonService.getMyTeamInStorage()){
      this.noteam = true;
    }else{
      this.pokemons = JSON.parse(this.pokemonService.getMyTeamInStorage())
      if(this.pokemons.length == 0){
        this.noteam = true;
      }else{
        this.noteam = false;
      }
    }

  }

}
