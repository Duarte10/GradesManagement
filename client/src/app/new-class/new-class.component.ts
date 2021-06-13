import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Toast } from "bootstrap";
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.scss']
})
export class NewClassComponent {

  wasValidated = false;
  newClassForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]]
  });

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

  showToast() {
    new Toast(document.getElementById("classToast")).show();
  }

  onSubmit(): void {
    if (this.newClassForm.dirty && this.newClassForm.valid) {
      // login request
      this.http.post('class', {
        name: this.newClassForm.value.name
      }).subscribe(
        () => {
          new Toast(document.getElementById("classToast")).show();
          // this.router.navigate([""]);
        },
        () => new Toast(document.getElementById("errorToast")).show()
      );
    } else {
      this.wasValidated = true;
    }
  }


}
