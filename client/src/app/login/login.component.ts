import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Toast } from "bootstrap";
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  wasValidated = false;
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

  onSubmit(): void {
    // login request
    console.log(this.loginForm);
    if (this.loginForm.dirty && this.loginForm.valid) {
      // login request
      this.http.post('authentication/login', {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        "application": "grades system"
      }).subscribe(
        (result: any) => {
          // store login data
          this.authService.saveLoginData(result.token, result.expiresAt);
          this.router.navigate([""]);
        },
        () => new Toast(document.getElementById("loginErrorToast")).show()
      );
    } else {
      this.wasValidated = true;
    }
  }

}
