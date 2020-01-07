import { SnackbarComponent } from './../../shared/snackbar.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './../modal/modal.component';
import { FilterService } from './../../services/filter.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {

  @Output() actualizar = new EventEmitter()

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar, 
            private filterService: FilterService) { }

  message: string;
  searchKey: string;
  currentPokemonEdit;
  
  ngOnInit() {
    this.filterService.currentMessage.subscribe(message => this.message = message)
  }

  newKey(key){
    this.filterService.updateKey(key)
  }

  updateKey(){
    this.newKey(this.searchKey)
  }
  
  openBuildDialog(element?){
    this.currentPokemonEdit = element;
    this.buildDialog(this.currentPokemonEdit)
  }

  buildDialog(data?){

    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        pokemon: data?data:{}
      }
    })
   
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.openSnackBar('El pokemon ha sido guardado')
        this.actualizar.emit('actualizar')
      }
    })
  }

  openSnackBar(message){
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message
    })
  }
}
