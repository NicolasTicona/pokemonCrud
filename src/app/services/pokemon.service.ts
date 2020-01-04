import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators'
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from '@angular/cdk/overlay/typings/overlay-directives';


@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  URL = 'https://pokeapi.co/api/v2/';

  currentID = 0;

  pokemonsJSON: object[] = [];

  headers = new HttpHeaders();
  
  constructor(private http: HttpClient) {
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
   }


  getPokemonsAPI(): any{  

    return this.http.get(this.URL+'pokemon'); 
   
  }

  getPokemonAPI(element_url){
      return this.http.get(element_url, {headers: this.headers})
  }

  addPokemon(pokemon){
    let pokemonFormated = this.formatPokemon(pokemon)
    console.log(pokemonFormated)
    this.pokemonsJSON.push(pokemonFormated)

    console.log(this.pokemonsJSON)
  }

  editPokemon(pokemon){
    console.log(pokemon)
    let posicion = this.pokemonsJSON.findIndex((element: any) => element.id === pokemon.id)

    this.pokemonsJSON[posicion] = pokemon;
  }

  deletePokemon(pokemon){
    console.log(pokemon)  
    var i = this.pokemonsJSON.indexOf( pokemon );
    
 
    if ( i !== -1 ) {
        this.pokemonsJSON.splice( i, 1 );
    }
    
    console.log(this.pokemonsJSON)
  }
  
  getAvailableAbilities(){
    return this.http.get(`${this.URL}ability`)
  }
  
  formatPokemon(pokemon) {
    this.currentID+=1;
    return {
      id:             this.currentID,
      nombre          : pokemon.name || pokemon.nombre,
      experiencia     : pokemon.base_experience || pokemon.experiencia,
      peso            : pokemon.weight || pokemon.peso,
      habilidad       : pokemon.habilidad || pokemon.abilities[0].ability.name
    };
  }
  
  
}



