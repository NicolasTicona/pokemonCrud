import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';

import { PokemonService } from './../../services/pokemon.service';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  form: FormGroup;

  habilidades: any = [];
  currentPokemon: any;

  loading: boolean = false;
  matcher = new MyErrorStateMatcher();


  constructor(
              @Inject(MAT_DIALOG_DATA) public data: any,
              private pokemonService: PokemonService 
  ) { 
    
    this.currentPokemon = data.pokemon;
  }

  ngOnInit(){

    this.loading = true;

    this.pokemonService.getAvailableAbilities().subscribe((resp: any) => {
      this.loading = false;
      this.habilidades = resp.results;
    })

    this.form = new FormGroup({
        nombre: new FormControl(this.currentPokemon.nombre, [Validators.required, 
                                                            Validators.maxLength(30),
                                                            Validators.pattern(`[a-zA-Z]*`)] ),
        peso: new FormControl(this.currentPokemon.peso, [Validators.required]),
        experiencia: new FormControl(this.currentPokemon.experiencia, [Validators.required, 
                                                                      Validators.min(1), 
                                                                      Validators.max(500)] ),
        habilidad: new FormControl(this.currentPokemon.habilidad, [Validators.required]),
          
    })

    // this.form.valueChanges()
  }

  saveForm(){

    // Actualizar
    if(this.currentPokemon.id){
      let pokemon = {
        id: this.currentPokemon.id,
        ...this.form.value};
      
      this.pokemonService.editPokemon(pokemon)
    }
    // Crear
    else{
      this.pokemonService.addPokemon(this.form.value)
    }
  }
}
