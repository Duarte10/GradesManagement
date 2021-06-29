import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Modal } from "bootstrap";
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  students = [];
  deleteStudentConfirmationModal: Modal;
  selectedStudentId: string;

  constructor(private http: HttpClient, private toast: ToastService) { }

  ngOnInit() {
    // load students
    this.http.get('student').subscribe(
      (data: any) => {
        this.students = data;
      },
      error => console.error(error)
    );

    this.deleteStudentConfirmationModal = new Modal(document.getElementById('deleteStudentConfirmModal'));
  }

  promptDelete(id) {
    this.selectedStudentId = id;
    if (this.deleteStudentConfirmationModal) {
      this.deleteStudentConfirmationModal.show();
    } else {
      console.error("Unexpected: deleteStudentConfirmationModal doesn't exist");
    }
  }

  confirmDelete() {
    this.http.delete('student/' + this.selectedStudentId)
      .subscribe(
        () => {
          this.toast.showToast("The student was deleted successfully");
          this.students = this.students.filter(c => c.id !== this.selectedStudentId);
          this.selectedStudentId = undefined;
          this.deleteStudentConfirmationModal.hide();
        },
        error => {
          this.toast.showToast("There was a problem deleting the student, please try again later.", "bg-danger text-white");
          console.error(error);
        }
      )
  }
}
