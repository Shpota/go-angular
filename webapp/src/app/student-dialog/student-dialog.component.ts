import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {StudentsService} from "../students.service";
import {Student} from "../student";

@Component({
  selector: 'student-dialog',
  templateUrl: 'student-dialog.component.html',
  styleUrls: ['student-dialog.component.scss'],
  providers: [StudentsService]
})
export class StudentDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public student: Student,
    public dialogRef: MatDialogRef<Student>,
    public service: StudentsService
  ) {}

  save() {
    if (this.student.id == null) {
      this.service.add(this.student)
        .subscribe(this.dialogRef.close)
    } else {
      this.service.update(this.student)
        .subscribe(this.dialogRef.close)
    }
  }

  delete() {
    this.service.delete(this.student.id)
      .subscribe(this.dialogRef.close)
  }
}
