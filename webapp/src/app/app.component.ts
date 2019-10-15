import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {StudentDialog} from "./student-dialog/student-dialog.component";
import {StudentsService} from "./students.service";
import {Student} from "./student";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [StudentsService]
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['name', 'age'];
  dataSource: Student[] = [];

  constructor(public dialog: MatDialog, public service: StudentsService) {}

  openEditDialog(st: Student) {
    this.openDialog(new Student(st.id, st.name, st.age));
  }

  ngOnInit(): void {
    this.loadStudentsList()
  }

  openNewDialog() {
    this.openDialog(new Student());
  }

  private openDialog(st: Student) {
    this.dialog.open(StudentDialog, {data: st, minWidth: '30%'})
      .afterClosed().subscribe(() => this.loadStudentsList());
  }

  loadStudentsList() {
    this.service.getAll().subscribe(students => this.dataSource = students);
  }
}
