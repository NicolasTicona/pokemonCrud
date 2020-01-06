import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';

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
              private pokemonService: PokemonService,
              private formBuilder: FormBuilder
  ) { 
    
    this.currentPokemon = data.pokemon;
  }

  ngOnInit(){

    this.loading = true;

    this.pokemonService.getAvailableAbilities().subscribe((resp: any) => {
      this.loading = false;
      this.habilidades = resp.results;
    })

    this.form = this.formBuilder.group({
        nombre: [this.currentPokemon.nombre, [Validators.required, 
                                              Validators.maxLength(30),
                                              Validators.pattern(`[a-zA-Z]*`)]],
        peso: [this.currentPokemon.peso, [Validators.required,
                                          Validators.min(1),
                                          Validators.max(500)]],
        experiencia: [this.currentPokemon.experiencia, [Validators.required, 
                                                        Validators.min(1), 
                                                        Validators.max(500)] ],
        habilidad: [this.currentPokemon.habilidad, [Validators.required]]
          
    })

    this.form.valueChanges.subscribe(state => console.log(state))
  }

  saveForm(){

    // Actualizar Pokemon
    if(this.currentPokemon.id){
      let pokemon = {
        id: this.currentPokemon.id,
        img: this.currentPokemon.img,
        ...this.form.value};
      
      this.pokemonService.editPokemon(pokemon)
      this.pokemonService.editMyPokemonOfStorage(pokemon)
    }
    // Crear
    else{
      // this.pokemonService.addPokemon(this.form.value)
      this.pokemonService.addMyPokemonToStorage(this.form.value)
    }
  }
}
