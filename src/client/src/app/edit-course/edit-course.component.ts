import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../shared/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit, OnDestroy {

  wasValidated = false;
  editCourseForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]]
  });

  private id: string;
  private routeSub: Subscription;
  constructor(private route: ActivatedRoute, private http: HttpClient, private formBuilder: FormBuilder, private toast: ToastService, private router: Router) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.loadCourse(this.id);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  onSubmit(): void {
    if (this.editCourseForm.dirty && this.editCourseForm.valid) {
      // login request
      this.http.put('course/' + this.id, {
        name: this.editCourseForm.value.name,
      }).subscribe(
        () => {
          this.toast.showToast("The course was updated successfully.");
          this.router.navigate(["courses"]);
        },
        error => {
          console.error(error);
          if (error.error.message) {
            this.toast.showToast(error.error.message, "bg-danger text-white");
          } else {
            this.toast.showToast("There was a problem updating the course, please try again later.", "bg-danger text-white");
          }
        }
      );
    } else {
      this.wasValidated = true;
    }
  }

  private loadCourse(id: string) {
    this.http.get('course/' + id).subscribe(
      (data: any) => {
        this.editCourseForm.setValue({
          name: data.name
        });
      },
      error => console.error(error)
    )
  }

}
