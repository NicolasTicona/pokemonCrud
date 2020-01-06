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
      if(this.getMyPokemonsOfStorage()){
        let pokemonsStorage = JSON.parse(this.getMyPokemonsOfStorage())
        for(let pokeSt of pokemonsStorage ){
          this.pokemonsJSON.unshift(pokeSt)
        }
      }

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
    console.log(pokemon)
    let posicion = this.pokemonsJSON.findIndex((element: any) => element.id === pokemon.id)
    this.pokemonsJSON[posicion] = pokemon;
  }

  deletePokemon(pokemon){
    var i = this.pokemonsJSON.indexOf( pokemon );
    if ( i !== -1 ) {
        this.pokemonsJSON.splice( i, 1 );
    }
  }

  // POKEMONS AGREGADOS AL TEAM
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
      let p = JSON.parse(this.getMyTeamInStorage()).findIndex((element: any) => element.nombre === pokemon.nombre)
      
      if(p !== -1){
        return false;
      }else{
        return true
      }
    }
  }

  // editPokemonTeamStorage(pokemon){
  //   let pokemons = JSON.parse(this.getMyTeamInStorage());
  //   let p = pokemons.findIndex((element: any) => element.id === pokemon.id)
  
  // }

  deletePokemonInStorage(pokemon){
    let pokemons = JSON.parse(this.getMyTeamInStorage())
    let posicion = pokemons.findIndex((element: any) => element.id === pokemon.id)
            
    pokemons.splice( posicion, 1 );  
    sessionStorage.setItem('equipo', JSON.stringify(pokemons))
  }

  getMyTeamInStorage(){
    return sessionStorage.getItem('equipo')
  }


  // MIS POKEMONS CREADOS
  getMyPokemonsOfStorage(){
    return sessionStorage.getItem('misPokemones')
  }

  addMyPokemonToStorage(pokemon){

    
    if(this.getMyPokemonsOfStorage() != null){
      let myPokemons = JSON.parse(this.getMyPokemonsOfStorage())

      let pokemonFormated = this.formatPokemon(pokemon)
      myPokemons.push(pokemonFormated)
      
      this.pokemonsJSON.unshift(pokemonFormated)
      sessionStorage.setItem('misPokemones', JSON.stringify(myPokemons))

    }else{
      let myPokemons = [];
      let pokemonFormated = this.formatPokemon(pokemon)
      myPokemons.push(pokemonFormated)
      this.pokemonsJSON.unshift(pokemonFormated)
      sessionStorage.setItem('misPokemones', JSON.stringify(myPokemons))
    }
  }

  editMyPokemonOfStorage(pokemon){
    let pokemons = JSON.parse(this.getMyPokemonsOfStorage())
    if(pokemons){
      console.log(pokemon)
      let posicion = pokemons.findIndex((element: any) => element.id === pokemon.id)
      if(posicion != -1){
        pokemons[posicion] = pokemon;
        sessionStorage.setItem('misPokemones', JSON.stringify(pokemons))
      }
    }
  }
  
  deleteMyPokemonOfStorage(pokemon){
    let pokemons = JSON.parse(this.getMyPokemonsOfStorage())
    if(pokemons){
      let posicion = pokemons.findIndex((element: any) => element.id === pokemon.id)
 
      if(posicion != -1){
        pokemons.splice( posicion, 1 );  
        sessionStorage.setItem('misPokemones', JSON.stringify(pokemons))
      }
    }
  }


  getAvailableAbilities(){
    return this.http.get(`${this.URL}ability?offset=0&limit=200`)
  }
  
  formatPokemon(pokemon) {
    this.currentID+=1;

    if(this.getMyPokemonsOfStorage() != null){
      let storagePokemons = JSON.parse(this.getMyPokemonsOfStorage());
 
      for(let element of storagePokemons){

        if(element.id === this.currentID){
          
          this.currentID++;
        }
      }
    }
    
    return {
      id:             this.currentID,
      nombre          : pokemon.name || pokemon.nombre,
      experiencia     : pokemon.base_experience || pokemon.experiencia,
      peso            : pokemon.weight || pokemon.peso,
      habilidades     : pokemon.habilidades || pokemon.abilities,
      img             : pokemon.sprites?pokemon.sprites["front_default"]:'assets/img/pokeball.jpg',
      stats           : pokemon.stats

    };
  }
  
  
}



