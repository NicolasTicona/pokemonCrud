import { RoutingModule } from './modules/routing/routing.module';
import { MaterialModule } from './modules/material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';



import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { ModalComponent } from './components/modal/modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './shared/loading.component';
import { SnackbarComponent } from './shared/snackbar.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { DetailsComponent } from './components/details/details.component';
import { ResumeStatPipe } from './pipes/resume-stat.pipe';
import { ListComponent } from './componenets/list/list.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    ModalComponent,
    LoadingComponent,
    SnackbarComponent,
    HomeComponent,
    NavbarComponent,
    DetailsComponent,
    ResumeStatPipe,
    ListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    RoutingModule
  ],
  entryComponents: [ModalComponent, DetailsComponent, SnackbarComponent],
  providers: [
    ErrorStateMatcher,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
