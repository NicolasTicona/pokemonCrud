import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  URL = 'https://pokeapi.co/api/v2/';
  pokemonsApI: any[] = []

  pokemonsJSON: object[] = [];

  headers = new HttpHeaders();
  
  constructor(private http: HttpClient) {
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  
   }

  getPokemons(): any{
    return this.http.get(`${this.URL}pokemon/?offset=0&limit=20`, {headers: this.headers})
      
  }

  getPokemon(element_url){
      return this.http.get(element_url, {headers: this.headers})
  
  }

  // setToJsonDB(data){
  //   for(let i = 0; i < data.length; i++){
  //     this.getPokemon(data[i].url)
  //   }
  // }
  
}
