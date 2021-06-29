import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../shared/toast.service';


@Component({
  selector: 'app-new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss']
})
export class NewCourseComponent {

  wasValidated = false;
  newCourseForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]]
  });

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private toast: ToastService, private router: Router) { }

  onSubmit(): void {
    if (this.newCourseForm.dirty && this.newCourseForm.valid) {
      // login request
      this.http.post('course', {
        name: this.newCourseForm.value.name,
      }).subscribe(
        () => {
          this.toast.showToast("The course was created successfully.");
          this.router.navigate(["courses"]);
        },
        error => {
          console.error(error);
          if (error.error.message) {
            this.toast.showToast(error.error.message, "bg-danger text-white");
          } else {
            this.toast.showToast("There was a problem creating the course, please try again later.", "bg-danger text-white");
          }
        }
      );
    } else {
      this.wasValidated = true;
    }
  }

}
