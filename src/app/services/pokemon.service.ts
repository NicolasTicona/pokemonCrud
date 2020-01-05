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
    this.pokemonsJSON = []
    // if(this.getMyPokemonsOfStorage()){
    //   let pokemonsStorage = JSON.parse(this.getMyPokemonsOfStorage())
    //   for(let pokeSt of pokemonsStorage ){
    //     this.pokemonsJSON.push(pokeSt)
    //   }
    // }

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
    console.log(i)
    if ( i !== -1 ) {
        this.pokemonsJSON.splice( i, 1 );
    }
  }

  saveMyTeamInStorage(pokemon){
    if(this.getMyTeamInStorage() != null){
      let pokemonsTeam = JSON.parse(this.getMyTeamInStorage())
      pokemonsTeam.push(pokemon)
      sessionStorage.setItem('equipo', JSON.stringify(pokemonsTeam))

    }else{
      let pokemonsTeam = [];
      pokemonsTeam.push(pokemon)
      sessionStorage.setItem('equipo', JSON.stringify(pokemonsTeam))
    }
  }

  verifyTeamStorage(pokemon){
    if(this.getMyTeamInStorage() != null){
      let p = JSON.parse(this.getMyTeamInStorage()).findIndex((element: any) => element.id === pokemon.id)

      if(p !== -1){
        return false;
      }else{
        return true
      }
    }
  }

  deletePokemonInStorage(pokemon){
    let pokemons = JSON.parse(this.getMyTeamInStorage())
    let posicion = pokemons.findIndex((element: any) => element.id === pokemon.id)
            
    pokemons.splice( posicion, 1 );  
    sessionStorage.setItem('equipo', JSON.stringify(pokemons))
  }

  getMyTeamInStorage(){
    return sessionStorage.getItem('equipo')
  }


  addMyPokemonToStorage(pokemon){
    if(this.getMyPokemonsOfStorage() != null){
      let myPokemons = JSON.parse(this.getMyPokemonsOfStorage())
      myPokemons.push(pokemon)
      sessionStorage.setItem('misPokemones', JSON.stringify(myPokemons))

    }else{
      let myPokemons = [];
      myPokemons.push(pokemon)
      sessionStorage.setItem('misPokemones', JSON.stringify(myPokemons))
    }
  }

  getMyPokemonsOfStorage(){
    return sessionStorage.getItem('misPokemones')
  }


  getAvailableAbilities(){
    return this.http.get(`${this.URL}ability`)
  }
  
  formatPokemon(pokemon) {
    this.currentID+=1;
    
    return {
      id:             this.currentID,
      selected:       false,
      nombre          : pokemon.name || pokemon.nombre,
      experiencia     : pokemon.base_experience || pokemon.experiencia,
      peso            : pokemon.weight || pokemon.peso,
      habilidad       : pokemon.habilidad || pokemon.abilities[0].ability.name,
      img             : pokemon.sprites?pokemon.sprites["front_default"]:'assets/img/pokeball.jpg'
    };
  }
  
  
}



