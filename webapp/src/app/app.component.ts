import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {StudentDialog} from "./student-dialog/student-dialog.component";
import {StudentsService} from "./students.service";
import {Student} from "./student";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  displayedColumns = ['name', 'age'];
  dataSource: Student[] = [];
  getAllSubscription: Subscription;
  dialogSubscription: Subscription;

  constructor(public dialog: MatDialog, public service: StudentsService) {}

  openEditDialog(st: Student) {
    this.openDialog(new Student(st.id, st.name, st.age));
  }

  openNewDialog(): void {
    this.openDialog(new Student());
  }

  private openDialog(st: Student): void {
    this.dialogSubscription = this.dialog
      .open(StudentDialog, {data: st, minWidth: '30%'})
      .afterClosed().subscribe(() => this.loadStudentsList());
  }

  private loadStudentsList(): void {
    this.getAllSubscription = this.service.getAll()
      .subscribe(students => this.dataSource = students);
  }

  ngOnInit(): void {
    this.loadStudentsList();
  }

  ngOnDestroy(): void {
    this.getAllSubscription.unsubscribe();
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }
}
