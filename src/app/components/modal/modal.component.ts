import { Component, Inject } from '@angular/core';


import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';


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
export class ModalComponent  {

  form: FormGroup;
  pokemon: any = {
    nombre: '',
    peso: 0,
    experiencia: 1,
    habilidad:''
  };


  matcher = new MyErrorStateMatcher();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, ) { 
    this.form = new FormGroup({
      nombre: new FormControl('', [Validators.required, 
                                     Validators.maxLength(1),
                                     Validators.pattern(`[a-zA-Z]*`)] ),
      peso: new FormControl('', [Validators.required]),
      experiencia: new FormControl('', [Validators.required, 
                                          Validators.min(1), 
                                          Validators.max(200)]),
      habilidad: new FormControl('', [Validators.required]),
    })
  }

  save(){
    console.log(this.form.value)
  }


}
