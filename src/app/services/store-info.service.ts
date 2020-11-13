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
    this.refreshSignedIn();
  }
  getToken(){
    return localStorage.getItem('token');
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  setToken(token){
    localStorage.setItem('token',token);
    this.refreshSignedIn();
  }

  setRefreshToken(refreshToken){
    localStorage.setItem('refreshToken',refreshToken);
  }
  refreshSignedIn(){
    this.isSignedIn = this.getToken()?true:false;
  }
  signOut(){
    console.log("signout")
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    this.refreshSignedIn();
  }
}
