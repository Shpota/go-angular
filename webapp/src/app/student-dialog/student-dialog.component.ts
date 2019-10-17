import {Component, Inject, OnDestroy} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {StudentsService} from "../students.service";
import {Student} from "../student";
import { Subscription } from 'rxjs';

@Component({
  selector: 'student-dialog',
  templateUrl: 'student-dialog.component.html',
  styleUrls: ['student-dialog.component.scss'],
  providers: [StudentsService]
})
export class StudentDialog implements OnDestroy {
  addSubscription: Subscription;
  updateSubscription: Subscription;
  deleteSubscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public student: Student,
    public dialogRef: MatDialogRef<Student>,
    public service: StudentsService
  ) {}

  save() {
    if (!this.student.id) {
      this.addSubscription = this.service.add(this.student)
        .subscribe(this.dialogRef.close);
    } else {
      this.updateSubscription = this.service.update(this.student)
        .subscribe(this.dialogRef.close);
    }
  }

  delete() {
    this.deleteSubscription = this.service.delete(this.student.id)
      .subscribe(this.dialogRef.close);
  }

  ngOnDestroy(): void {
    if (this.addSubscription) {
      this.addSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }
}
