import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Toast } from "bootstrap";
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {

  classes = [];
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    // load classes
    this.http.get('class').subscribe(
      (data: any) => {
        this.classes = data;
        console.log(data);
      },
      error => console.error(error)
    )
  }
}
