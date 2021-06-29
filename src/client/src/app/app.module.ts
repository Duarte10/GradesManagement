import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './shared/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import "bootstrap";

import { ApiInterceptor } from './shared/api.interceptor';
import { ClassComponent } from './class/class.component';
import { NewClassComponent } from './new-class/new-class.component';
import { HomeComponent } from './home/home.component';
import { ToastService } from './shared/toast.service';
import { EditClassComponent } from './edit-class/edit-class.component';
import { StudentComponent } from './student/student.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { NewStudentComponent } from './new-student/new-student.component';
import { ViewClassComponent } from './view-class/view-class.component';
import { EditClassSemesterComponent } from './edit-class-semester/edit-class-semester.component';
import { CoursesComponent } from './courses/courses.component';
import { NewCourseComponent } from './new-course/new-course.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClassComponent,
    NewClassComponent,
    NavbarComponent,
    HomeComponent,
    EditClassComponent,
    StudentComponent,
    EditStudentComponent,
    NewStudentComponent,
    ViewClassComponent,
    EditClassSemesterComponent,
    CoursesComponent,
    NewCourseComponent,
    EditCourseComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AutocompleteLibModule
  ],
  providers: [
    AuthService,
    ToastService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
