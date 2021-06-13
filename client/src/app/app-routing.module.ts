import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthActivator } from './auth.activator';
import { NavbarComponent } from './navbar/navbar.component';
import { NewClassComponent } from './new-class/new-class.component';
import { ClassComponent } from './class/class.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
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
    ]
  },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthActivator]
})
export class AppRoutingModule { }
