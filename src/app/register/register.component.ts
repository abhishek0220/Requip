import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StoreInfoService }  from '../services/store-info.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signupForm: FormGroup;
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
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      phone_number: ['', [Validators.required]]
    })
  }
  async signUp(){
    console.log("sign press", this.storeInfo.isSignedIn)
    if(!this.signupForm.valid) return false;
    else{
      this.http.post(this.storeInfo.serverUrl + '/registration',this.signupForm.value).pipe().subscribe((data)=>{
        if(!data["username"]){
          this.openSnackBar(data['message'],"Close")
          console.log("invalid");
          this.storeInfo.signOut();
          return;
        }
        else{
          this.openSnackBar(`Pls check your email ${data['message']}`,"Close")
          console.log("done");
          this.router.navigateByUrl('login');
        }
      },error =>{
        console.log(error)
      })
    }
  }
}
