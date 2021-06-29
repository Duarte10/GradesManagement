import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-new-student',
  templateUrl: './new-student.component.html',
  styleUrls: ['./new-student.component.scss']
})
export class NewStudentComponent {

  wasValidated = false;
  newStudentForm = this.formBuilder.group({
    number: ['', [Validators.required, Validators.minLength(2)]],
    name: ['', [Validators.required, Validators.minLength(2)]]
  });

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private toast: ToastService, private router: Router) { }

  onSubmit(): void {
    if (this.newStudentForm.dirty && this.newStudentForm.valid) {
      // login request
      this.http.post('student', {
        number: this.newStudentForm.value.number,
        name: this.newStudentForm.value.name,
      }).subscribe(
        () => {
          this.toast.showToast("The student was created successfully.");
          this.router.navigate(["student"]);
        },
        error => {
          console.error(error);
          if (error.error.message) {
            this.toast.showToast(error.error.message, "bg-danger text-white");
          } else {
            this.toast.showToast("There was a problem creating the student, please try again later.", "bg-danger text-white");
          }
        }
      );
    } else {
      this.wasValidated = true;
    }
  }
}
