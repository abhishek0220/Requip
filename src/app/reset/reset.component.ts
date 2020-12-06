import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StoreInfoService }  from '../services/store-info.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  resetForm: FormGroup;
  user : string;
  token : string;
  constructor(
    public fb: FormBuilder,
    private http: HttpClient,
    private storeInfo: StoreInfoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private location : Location,
    private activatedRoute: ActivatedRoute,
  ) {
    this.mainForm();
  }

  ngOnInit(){
    if(this.storeInfo.isSignedIn){
      this.router.navigateByUrl('');
      return;
    }
    this.user = this.activatedRoute.snapshot.paramMap.get('_id').toString();
    this.token = this.activatedRoute.snapshot.paramMap.get('token').toString();
    this.location.go('/reset')
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  mainForm() {
    this.resetForm = this.fb.group({
      conpassword: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }
  async reset(){
    console.log("grfeds")
    if(!this.resetForm.valid){
      this.openSnackBar("Invalid Input","Close")
      return false;
    }
    else if(this.resetForm.get('password').value != this.resetForm.get('conpassword').value){
      this.openSnackBar("Pasword must be same","Close")
      return false;
    }
    else{
      this.storeInfo.toggleLoader();
      var par_obj = {
        'token' : this.token,
        'password' : this.resetForm.get('password').value
      }
      this.http.post(this.storeInfo.serverUrl + '/reset/' + this.user, par_obj).pipe().subscribe((data)=>{
        this.storeInfo.toggleLoader();
        this.openSnackBar(`${data['message']}`,"Close")
      },error =>{
        this.storeInfo.loader = false;
        this.openSnackBar("Invalid Token","Close")
        console.log(error)
      })
    }
  }

}
