import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreInfoService {
  token:string;
  serverUrl: string;
  isSignedIn : boolean;
  userid:string;
  image:string;
  mediaServer : string;
  loader = false;
  constructor() {
    this.serverUrl = environment.serverUrl;
    this.mediaServer = environment.mediaServerUrl;
    this.refresh();
    this.image = this.getImage();
  }
  getToken(){
    return localStorage.getItem('token');
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }
  getImage(){
    return localStorage.getItem('image');
  }
  getUser(){
    return localStorage.getItem('userId');
  }
  toggleLoader(){
    this.loader = !this.loader;
  }

  setToken(token){
    localStorage.setItem('token',token);
    this.refresh();
  }

  setUser(user){
    this.userid = user;
    localStorage.setItem('userId',user);
  }
  setImage(loc){
    this.image = loc;
    localStorage.setItem('image',loc);
  }

  setRefreshToken(refreshToken){
    localStorage.setItem('refreshToken',refreshToken);
  }
  refresh(){
    this.userid = this.getUser();
    this.isSignedIn = this.getToken()?true:false;
  }
  signOut(){
    console.log("signout")
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    this.refresh();
  }
}
