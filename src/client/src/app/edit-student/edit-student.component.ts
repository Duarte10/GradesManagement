import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../shared/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})
export class EditStudentComponent implements OnInit, OnDestroy {

  wasValidated = false;
  editStudentForm = this.formBuilder.group({
    number: ['', [Validators.required, Validators.minLength(2)]],
    name: ['', [Validators.required, Validators.minLength(2)]]
  });

  private id: string;
  private routeSub: Subscription;
  constructor(private route: ActivatedRoute, private http: HttpClient, private formBuilder: FormBuilder, private toast: ToastService, private router: Router) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.loadStudent(this.id);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  onSubmit(): void {
    if (this.editStudentForm.dirty && this.editStudentForm.valid) {
      // login request
      this.http.put('student/' + this.id, {
        number: this.editStudentForm.value.number,
        name: this.editStudentForm.value.name,
      }).subscribe(
        () => {
          this.toast.showToast("The student was updated successfully.");
          this.router.navigate(["student"]);
        },
        error => {
          console.error(error);
          if (error.error.message) {
            this.toast.showToast(error.error.message, "bg-danger text-white");
          } else {
            this.toast.showToast("There was a problem updating the student, please try again later.", "bg-danger text-white");
          }
        }
      );
    } else {
      this.wasValidated = true;
    }
  }

  private loadStudent(id: string) {
    this.http.get('student/' + id).subscribe(
      (data: any) => {
        this.editStudentForm.setValue({
          number: data.number,
          name: data.name
        });
      },
      error => console.error(error)
    )
  }
}
