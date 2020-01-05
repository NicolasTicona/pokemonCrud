import { PokemonService } from './../../services/pokemon.service';
import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  pokemon: any;
  // pokemon = {
  //   nombre: 'pikachu',
  //   peso: '24',
  //   experiencia: '300',
  //   habilidad: 'Morder'
  // }

  constructor(
              @Inject(MAT_DIALOG_DATA) public data:any,
              private pokemonService: PokemonService

  ) { 
  }

  ngOnInit() {
  
    this.pokemon = this.data.pokemon;
    
    console.log(this.pokemon)
  }

}
