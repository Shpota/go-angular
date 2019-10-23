import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {StudentDialog} from "./student-dialog/student-dialog.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import {MatToolbarModule} from "@angular/material/toolbar";
import {StudentsService} from "./students.service";

@NgModule({
  declarations: [
    AppComponent,
    StudentDialog
  ],
  imports: [
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    ReactiveFormsModule
  ],
  providers: [
    StudentsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [StudentDialog]
})
export class AppModule {
}
