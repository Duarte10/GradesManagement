import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Modal } from "bootstrap";
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses = [];
  deleteCourseConfirmationModal: Modal;
  selectedCourseId: string;

  constructor(private http: HttpClient, private toast: ToastService) { }

  ngOnInit() {
    // load students
    this.http.get('course').subscribe(
      (data: any) => {
        this.courses = data;
      },
      error => console.error(error)
    );

    this.deleteCourseConfirmationModal = new Modal(document.getElementById('deleteCourseConfirmationModal'));
  }

  promptDelete(id) {
    this.selectedCourseId = id;
    if (this.deleteCourseConfirmationModal) {
      this.deleteCourseConfirmationModal.show();
    } else {
      console.error("Unexpected: deleteCourseConfirmationModal doesn't exist");
    }
  }

  confirmDelete() {
    this.http.delete('course/' + this.selectedCourseId)
      .subscribe(
        () => {
          this.toast.showToast("The course was deleted successfully");
          this.courses = this.courses.filter(c => c.id !== this.selectedCourseId);
          this.selectedCourseId = undefined;
          this.deleteCourseConfirmationModal.hide();
        },
        error => {
          this.toast.showToast("There was a problem deleting the course, please try again later.", "bg-danger text-white");
          console.error(error);
        }
      )
  }
}
