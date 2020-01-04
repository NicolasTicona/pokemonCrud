import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  URL = 'https://pokeapi.co/api/v2/';
  currentID = 0;
  pokemonsJSON: object[] = [];
  


  constructor(private http: HttpClient) {}

  getPokemonsAPI(): any{  
    return this.http.get(`${this.URL}pokemon`); 
  }

  getPokemonAPI(element_url){
      return this.http.get(element_url)
  }

  addPokemon(pokemon){
    let pokemonFormated = this.formatPokemon(pokemon)
    this.pokemonsJSON.unshift(pokemonFormated)
  }

  editPokemon(pokemon){
    let posicion = this.pokemonsJSON.findIndex((element: any) => element.id === pokemon.id)
    this.pokemonsJSON[posicion] = pokemon;
  }

  deletePokemon(pokemon){
    var i = this.pokemonsJSON.indexOf( pokemon );

    if ( i !== -1 ) {
        this.pokemonsJSON.splice( i, 1 );
    }
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



