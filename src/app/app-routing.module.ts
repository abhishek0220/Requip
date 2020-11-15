import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { EditpostComponent } from './editpost/editpost.component';
import { CreatepostComponent } from './createpost/createpost.component';

const routes: Routes = [
  {
    path:'',
    component: HomeComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'signup',
    component: RegisterComponent
  },
  {
    path:'profile/:userid',
    component: ProfileComponent
  },
  {
    path:'edit/profile',
    component: ProfileEditComponent
  },
  {
    path:'edit/post',
    component: EditpostComponent
  },
  {
    path:'add',
    component: CreatepostComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }