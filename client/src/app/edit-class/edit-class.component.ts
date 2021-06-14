import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../shared/toast.service';
import { Modal } from "bootstrap";

@Component({
  selector: 'app-edit-class',
  templateUrl: './edit-class.component.html',
  styleUrls: ['./edit-class.component.scss']
})
export class EditClassComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private toast: ToastService, private formBuilder: FormBuilder) { }

  wasValidated = false;
  editClassForm = this.formBuilder.group({
    code: ['', [Validators.required, Validators.minLength(2)]],
    name: ['', [Validators.required, Validators.minLength(2)]]
  });
  semesters = [];
  courses = [];

  newSemesterYear: Number;
  newSemesterName = "Spring";
  class: any;
  deleteSemesterConfirmationModal: Modal;
  @ViewChild('coursesAutoComplete', { static: false }) coursesAutoComplete;
  coursesAutoCompleteData = [];
  selectedCourse: any;

  private selectedSemesterId: string;
  private deletedSemesters = [];
  private routeSub: Subscription;
  private id: string;

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.loadClass(this.id);
      }
    });

    this.loadCourses();
    this.deleteSemesterConfirmationModal = new Modal(document.getElementById('deleteSemesterConfirmModal'));
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  onNewSemesterYearChange(event: any) {
    this.newSemesterYear = event.target.value;
  }

  onNewSemesterNameChange(event: any) {
    this.newSemesterName = event.target.value;
  }

  addSemester() {
    if (!this.selectedCourse) {
      this.toast.showToast("Enter a course", "bg-danger text-white");
    }
    if (!this.newSemesterYear || !this.newSemesterName || this.newSemesterYear < 0) {
      this.toast.showToast("Enter a valid year", "bg-danger text-white");
      return;
    }

    if (this.semesters.find(s => s.year === this.newSemesterYear && s.name === this.newSemesterName)) {
      // Do nothing
      console.log('semester already exists');
      return;
    }

    // Add the semester
    this.semesters.push({ year: this.newSemesterYear, name: this.newSemesterName, coruse: this.selectedCourse });

    // Clear the form
    this.newSemesterYear = undefined;
    this.newSemesterName = "Spring";
    this.selectedCourse = undefined;

    // Mark form as dirty
    this.editClassForm.markAsDirty();
  }

  onSubmit(): void {
    if (!this.editClassForm.dirty) {
      // no changes were made, redirect to class page
      this.router.navigate(["class"]);
      return;
    }

    if (this.editClassForm.valid) {
      // login request
      this.http.put('class/' + this.id, {
        code: this.editClassForm.value.code,
        name: this.editClassForm.value.name,
        semesters: this.semesters,
        deletedSemesters: this.deletedSemesters
      }).subscribe(
        () => {
          this.toast.showToast("The class was updated successfully.");
          this.router.navigate(["class"]);
        },
        error => {
          console.error(error);
          if (error.error.message) {
            this.toast.showToast(error.error.message, "bg-danger text-white");
          } else {
            this.toast.showToast("There was a problem updating the class, please try again later.", "bg-danger text-white");
          }
        }
      );
    } else {
      this.wasValidated = true;
    }
  }

  promptSemesterDelete(semester: any) {
    if (!semester.id) {
      // if the id is undefined it means it is a semester that was created now
      // for the semesters created now, don't prompt to confirm the change as it's not going to affect existing data

      this.semesters.splice(this.semesters.indexOf(semester), 1);
      this.selectedSemesterId = undefined;
      return;
    }
    this.selectedSemesterId = semester.id;
    if (this.deleteSemesterConfirmationModal) {
      this.deleteSemesterConfirmationModal.show();
    } else {
      console.error("Unexpected: deleteSemesterConfirmationModal doesn't exist");
    }
  }

  confirmSemesterDelete() {
    this.deletedSemesters.push(this.selectedSemesterId);
    this.semesters = this.semesters.filter(s => s.id !== this.selectedSemesterId);
    this.selectedSemesterId = undefined;

    this.deleteSemesterConfirmationModal.hide();

    // Mark form as dirty
    this.editClassForm.markAsDirty();
  }

  selectCourse(course: any) {
    this.selectedCourse = course;
  }

  private loadClass(id: string) {
    this.http.get('class/' + id).subscribe(
      (data: any) => {
        this.editClassForm.setValue({
          code: data.code,
          name: data.name
        });
        this.semesters = data.semesters;
      },
      error => console.error(error)
    )
  }

  private loadCourses() {
    this.http.get('course').subscribe(
      (data: any) => {
        this.courses = data;
        this.coursesAutoCompleteData = data.map(c => {
          return {
            id: c.id,
            name: c.name
          }
        })
      },
      error => console.error(error)
    )
  }

}
