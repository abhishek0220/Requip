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
  constructor() {
    this.serverUrl = environment.serverUrl;
    this.refresh();
  }
  getToken(){
    return localStorage.getItem('token');
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  getUser(){
    return localStorage.getItem('userId');
  }

  setToken(token){
    localStorage.setItem('token',token);
    this.refresh();
  }

  setUser(user){
    this.userid = user;
    localStorage.setItem('userId',user);
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
