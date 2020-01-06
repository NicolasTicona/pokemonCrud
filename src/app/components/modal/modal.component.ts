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
  errorSuma: boolean = false;

  statsHabilitados: boolean = false;

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
      
      let pokemonHabilidades: any = [];

      if(this.currentPokemon.habilidades){
      
        for(let h = 0; h < this.currentPokemon.habilidades.length; h++){
          pokemonHabilidades.push(this.currentPokemon.habilidades[h].ability.name)
        }
      }else{
        pokemonHabilidades = [];
      }
     
      
      this.form = this.formBuilder.group({
          nombre: [this.currentPokemon.nombre, [Validators.required, 
                                                Validators.maxLength(30),
                                                Validators.pattern(`[a-zA-Z]*`)]],
          peso: [this.currentPokemon.peso, [Validators.required,
                                            Validators.min(1),
                                            Validators.max(500)]],
          experiencia: [this.currentPokemon.experiencia, [Validators.required, 
                                                          Validators.min(1), 
                                                          Validators.maxLength(500)] ],
          
          checkbox: [true],
          habilidades: [pokemonHabilidades, Validators.required],

          stats: this.formBuilder.group({
            speed          : [this.currentPokemon.stats ? this.currentPokemon.stats[0].base_stat : 50],
            specialDefense : [this.currentPokemon.stats ? this.currentPokemon.stats[1].base_stat : 50],
            specialAttack  : [this.currentPokemon.stats ? this.currentPokemon.stats[2].base_stat : 50],
            defense        : [this.currentPokemon.stats ? this.currentPokemon.stats[3].base_stat : 50],
            attack         : [this.currentPokemon.stats ? this.currentPokemon.stats[4].base_stat : 50],
            hp             : [this.currentPokemon.stats ? this.currentPokemon.stats[5].base_stat : 50],
          }),
          

        }, {floatLabel: 'auto'})

        this.form.controls.stats.valueChanges.subscribe(state=> {

          let speed = state.speed;
          let specialDefense = state.specialDefense;
          let specialAttack = state.specialAttack;
          let defense = state.defense;
          let attack = state.attack;
          let hp = state.hp;
          
          if(speed && specialDefense && specialAttack && defense && attack && hp){
            let suma = speed + specialDefense + specialAttack + defense + attack + hp;
            if(suma > 600){
              this.form.controls.stats.setErrors({maxPoder: true})
              this.errorSuma = true;
            }else{
              this.form.valid;
              this.errorSuma = false;
            }
          }

        })
    })

  }

  habilitarHabilidades(event){

    if(!event.checked){
      this.form.controls.habilidades.setValue([])
      this.form.controls.habilidades.disable({onlySelf: false})
      this.form.controls.habilidades.clearValidators()
      this.form.controls.habilidades.setErrors({required: false})
    }else{
      this.form.controls.habilidades.setValue([])
      this.form.controls.habilidades.enable({onlySelf: false})
      this.form.controls.habilidades.setValidators(Validators.required)
      this.form.controls.habilidades.setErrors({required: true})

    }
  }

  maxSelectionHabilidades(event){
    let count = event.value.length;
    if(count > 5){
      this.form.controls["habilidades"].setErrors({maximo: true})
    }else{
      
    }
  }

  changeCustomStat(event){
  }

  habilitarStats(event){
    this.statsHabilitados = !this.statsHabilitados;
  }


  saveForm(){

    let countHabilidades;
    let habilidades
    
    if(this.form.value.habilidades){

      countHabilidades = this.form.value.habilidades.length?this.form.value.habilidades.length:0;
      habilidades = [];

      for(let i = 0; i < countHabilidades; i++){
        habilidades.push({
          ability: {name: this.form.value.habilidades[i]}
        })
      }
      
    }else{
      habilidades = [];
    }



    // Actualizar Pokemon
    if(this.currentPokemon.id){
      let pokemon = {
        id: this.currentPokemon.id,
        img: this.currentPokemon.img,
        nombre: this.form.value.nombre,
        peso: this.form.value.peso,
        habilidades: habilidades,
        experiencia: this.form.value.experiencia,
        stats: [
          
            {
              base_stat: this.form.value.stats.speed,
              stat: {name:"speed"}
            },
            {
              base_stat: this.form.value.stats.specialDefense,
              stat: {name:"special-defense"}
            },
            {
              base_stat: this.form.value.stats.specialAttack,
              stat: {name:"special-attack"}
            },
            {
              base_stat: this.form.value.stats.defense,
              stat: {name:"defense"}
            },
            {
              base_stat: this.form.value.stats.attack,
              stat: {name:"attack"}
            },
            {
              base_stat: this.form.value.stats.hp,
              stat: {name:"hp"}
            },
            
          ]
        };
      
      this.pokemonService.editPokemon(pokemon)
      this.pokemonService.editMyPokemonOfStorage(pokemon)
    }
    // Crear
    else{
      // this.pokemonService.addPokemon(this.form.value)
      let pokemon = {
        nombre: this.form.value.nombre,
        peso: this.form.value.peso,
        experiencia: this.form.value.experiencia,
        habilidades: habilidades,
        stats: [
          
            {
              base_stat: this.form.value.stats.speed,
              stat: {name:"speed"}
            },
            {
              base_stat: this.form.value.stats.specialDefense,
              stat: {name:"special-defense"}
            },
            {
              base_stat: this.form.value.stats.specialAttack,
              stat: {name:"special-attack"}
            },
            {
              base_stat: this.form.value.stats.defense,
              stat: {name:"defense"}
            },
            {
              base_stat: this.form.value.stats.attack,
              stat: {name:"attack"}
            },
            {
              base_stat: this.form.value.stats.hp,
              stat: {name:"hp"}
            },
            
          ]
        
      }

      this.pokemonService.addMyPokemonToStorage(pokemon)
    }
  }
}
