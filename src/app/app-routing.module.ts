import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'
import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';

 const routes: Routes = [{ path: 'login', component: LoginComponent },
{path:'register',component:RegisterComponent}];
@NgModule({
  declarations: [],
  imports: [ RouterModule.forRoot(routes)  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
