import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Toast } from "bootstrap";
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { ToastService } from '../shared/toast.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  wasValidated = false;
  registerForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.checkPasswords });

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private toast: ToastService) { }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;
    return password === confirmPassword ? null : { notSame: true }
  }

  onSubmit(): void {
    // login request
    if (this.registerForm.dirty && this.registerForm.valid) {

      // login request
      this.http.post('authentication/register', {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        "application": "grades system"
      }).subscribe(
        (result: any) => {
          // store login data
          this.router.navigate(["login"]);
          this.toast.showToast("The account was created successfully!");
        },
        () => this.toast.showToast("There was a problem creating the account, please try again later")
      );
    } else {
      this.wasValidated = true;
    }
  }
}
