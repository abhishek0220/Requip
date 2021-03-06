import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { EditpostComponent } from './editpost/editpost.component';
import { CreatepostComponent } from './createpost/createpost.component';
import { ViewPostComponent } from './view-post/view-post.component';
import { ResetComponent } from './reset/reset.component';
import { VerifyComponent } from './verify/verify.component';
import { PostsComponent } from './posts/posts.component';
import { EntertainmentComponent } from './entertainment/entertainment.component';

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
    path:'posts',
    component: PostsComponent
  },
  {
    path:'media',
    component: EntertainmentComponent
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
    path:'edit/post/:postID',
    component: EditpostComponent
  },
  {
    path:'add',
    component: CreatepostComponent
  },
  {
    path:'post/:postID',
    component: ViewPostComponent
  },
  {
    path: 'reset/:_id/:token',
    component: ResetComponent
  },
  {
    path: 'verify/:_id/:token',
    component: VerifyComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
