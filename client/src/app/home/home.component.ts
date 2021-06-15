import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  totalCourses = 0;
  totalClasses = 0;
  totalStudents = 0;
  classes = [];
  classSemesters = [];
  visibleClassSemesters = [];
  currentYear = 2021;

  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.loadTotals();
    this.loadClasses();
  }

  back() {
    this.currentYear--;
    this.filterVisibleSemesterClasses();
  }

  forward() {
    this.currentYear++;
    this.filterVisibleSemesterClasses();
  }

  private filterVisibleSemesterClasses() {
    this.visibleClassSemesters = this.classSemesters.filter(s => s.year === this.currentYear);
  }

  private loadClasses() {
    this.http.get('class').subscribe(
      (data: any) => {
        this.classes = data;
        this.loadSemesterClasses();
      });
  }

  private loadSemesterClasses() {
    this.http.get('class-semester').subscribe(
      (data: any) => {
        for (let i = 0; i < data.length; i++) {
          const currentSemester = data[i];
          // find the class

          for (let j = 0; j < this.classes.length; j++) {
            const currentClass = this.classes[j];
            if (currentClass.semesters.find(s => s === currentSemester._id)) {
              currentSemester.class = currentClass.name;
              this.classSemesters.push(currentSemester);
              break;
            }
          }

        }
        this.filterVisibleSemesterClasses();
      });
  }

  private loadTotals() {
    this.http.get('home').subscribe((data: any) => {
      this.totalCourses = data.totalCourses;
      this.totalClasses = data.totalClasses;
      this.totalStudents = data.totalStudents;
    });
  }

}
