import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.scss']
})
export class NewClassComponent {

  wasValidated = false;
  newClassForm = this.formBuilder.group({
    code: ['', [Validators.required, Validators.minLength(2)]],
    name: ['', [Validators.required, Validators.minLength(2)]]
  });
  semesters = [];

  newSemesterYear: Number;
  newSemesterName = "Spring";

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private toast: ToastService, private router: Router) { }

  onNewSemesterYearChange(event: any) {
    this.newSemesterYear = event.target.value;
  }

  onNewSemesterNameChange(event: any) {
    this.newSemesterName = event.target.value;
  }

  addSemester() {
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
    this.semesters.push({ year: this.newSemesterYear, name: this.newSemesterName });

    // Clear the form
    this.newSemesterYear = undefined;
    this.newSemesterName = "Spring";
  }

  onSubmit(): void {
    if (this.newClassForm.dirty && this.newClassForm.valid) {
      // login request
      this.http.post('class', {
        code: this.newClassForm.value.code,
        name: this.newClassForm.value.name,
        semesters: this.semesters
      }).subscribe(
        () => {
          this.toast.showToast("The class was created successfully.");
          this.router.navigate(["class"]);
        },
        error => {
          console.error(error);
          if (error.error.message) {
            this.toast.showToast(error.error.message, "bg-danger text-white");
          } else {
            this.toast.showToast("There was a problem creating the class, please try again later.", "bg-danger text-white");
          }
        }
      );
    } else {
      this.wasValidated = true;
    }
  }


}
