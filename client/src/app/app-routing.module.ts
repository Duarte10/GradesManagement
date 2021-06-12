import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthActivator } from './auth.activator';
import { NavbarComponent } from './navbar/navbar.component';
import { NewClassComponent } from './new-class/new-class.component';
import { ClassComponent } from './class/class.component';


const routes: Routes = [
  {
    path: '', component: NavbarComponent,
    canActivate: [AuthActivator],
    children: [
      // {
      //   path: 'class',
      //   component: ClassComponent
      // },
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
