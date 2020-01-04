import { MaterialModule } from './modules/material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';



import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { ModalComponent } from './components/modal/modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './components/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    ModalComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule
  ],
  entryComponents: [ModalComponent],
  providers: [ErrorStateMatcher],
  bootstrap: [AppComponent]
})
export class AppModule { }
