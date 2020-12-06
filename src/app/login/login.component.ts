import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StoreInfoService }  from '../services/store-info.service';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  idng :string;
  
  constructor(
    public fb: FormBuilder,
    private http: HttpClient,
    private storeInfo: StoreInfoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.mainForm();
  }
  ngOnInit(){
    if(this.storeInfo.isSignedIn){
      this.router.navigateByUrl('');
      return;
    }
    
    
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  mainForm() {
    this.loginForm = this.fb.group({
      id: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }
  async login(){
    console.log("login press", this.storeInfo.isSignedIn)
    if(!this.loginForm.valid){
      this.openSnackBar("Invalid Input","Close")
      return false;
    }
    else{
      this.storeInfo.loader = true;
      this.http.post(this.storeInfo.serverUrl + '/login',this.loginForm.value).pipe().subscribe((data)=>{
        this.storeInfo.loader = false;
        if(!data["username"]){
          console.log("invalid");
          this.openSnackBar("Invalid Credentials","Close")
          this.storeInfo.signOut();
          return;
        }
        else{
          this.openSnackBar(`Welcome ${data['username']}`,"Close")
          console.log("done", data['username']);
          this.storeInfo.setUser(data['username']);
          this.storeInfo.setToken(data['access_token']);
          this.storeInfo.setRefreshToken(data['refresh_token']);
          this.router.navigateByUrl('');
        }
        
      },error =>{
        this.storeInfo.loader = false;
        this.openSnackBar("Some Error Occured","Close")
        console.log(error)
      })
    }
  }
  async reset(){
    var user = this.loginForm.get('id').value;
    console.log(user)
    this.storeInfo.toggleLoader();
    this.http.get(this.storeInfo.serverUrl + '/reset/' + user).pipe().subscribe((data)=>{
      this.storeInfo.toggleLoader();
      this.openSnackBar(`${data['message']}`,"Close")
    },error =>{
      this.storeInfo.toggleLoader();
      this.openSnackBar("Some Error Occured","Close")
      console.log(error)
    })
  }
}
