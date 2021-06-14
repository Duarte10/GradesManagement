import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthActivator } from './shared/auth.activator';
import { NavbarComponent } from './navbar/navbar.component';
import { NewClassComponent } from './new-class/new-class.component';
import { ClassComponent } from './class/class.component';
import { HomeComponent } from './home/home.component';
import { EditClassComponent } from './edit-class/edit-class.component';
import { StudentComponent } from './student/student.component';
import { NewStudentComponent } from './new-student/new-student.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { ViewClassComponent } from './view-class/view-class.component';
import { EditClassSemesterComponent } from './edit-class-semester/edit-class-semester.component';
import { CoursesComponent } from './courses/courses.component';
import { NewCourseComponent } from './new-course/new-course.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/courses',
    pathMatch: 'full'
  },
  {
    path: '', component: NavbarComponent,
    canActivate: [AuthActivator],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'class',
        component: ClassComponent
      },
      {
        path: 'class/new',
        component: NewClassComponent
      },
      {
        path: 'class/:id/edit',
        component: EditClassComponent
      },
      {
        path: 'class/:id',
        component: ViewClassComponent
      },
      {
        path: 'class/:id/semester/:semesterId',
        component: EditClassSemesterComponent
      },
      {
        path: 'student',
        component: StudentComponent
      },
      {
        path: 'student/new',
        component: NewStudentComponent
      },
      {
        path: 'student/:id/edit',
        component: EditStudentComponent
      },
      {
        path: 'courses',
        component: CoursesComponent
      },
      {
        path: 'courses/new',
        component: NewCourseComponent
      },
      {
        path: 'courses/:id/edit',
        component: EditCourseComponent
      },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthActivator]
})
export class AppRoutingModule { }
