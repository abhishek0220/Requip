import { Component, OnInit } from '@angular/core';
import { StoreInfoService } from '../services/store-info.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  progress: number;
  infoMessage: any;
  isUploading: boolean = false;
  file: File;
  imageUrl: string;
  fileName: string = "No file selected";
  uploaded = false;
  image64: string;
  profileForm: FormGroup;
  username = "";
  email = "";
  constructor(
    private storeInfo : StoreInfoService,
    private router : Router,
    private http: HttpClient,
    public fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if(!this.storeInfo.isSignedIn){
      this.router.navigateByUrl('login');
      return;
    }
    this.image64 = "";
    this.imageUrl = `${this.storeInfo.mediaServer}/${this.storeInfo.image}`;
    this.mainForm();
    this.getVal();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  mainForm() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      about: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    })
  }
  getVal(){
    this.storeInfo.loader = true;
    this.http.get(this.storeInfo.serverUrl+'/profile').pipe().subscribe((data)=>{
      this.profileForm.controls['name'].setValue(data['name']);
      this.profileForm.controls['about'].setValue(data['about']);
      this.profileForm.controls['phone'].setValue(data['phone']);
      this.username = data['username'];
      this.email = data['email'];
      this.storeInfo.loader = false;
    },error =>{
      this.storeInfo.loader = false;
      this.openSnackBar('Some Error Occured','Close')
    })
  }
  onChange(file: File) {
    this.uploaded = false;
    if (file) {
      console.log(file);
      this.fileName = file.name;
      this.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        this.compressImage(reader.result, 400,400).then((compressed : string) => {
          console.log(compressed.length);
          this.imageUrl = compressed;
          this.image64 = compressed;
          this.uploaded = true;
          
        })
      };
    }
  }
  upload() {
    if(this.uploaded){
      this.storeInfo.loader = true;
      this.http.post(this.storeInfo.serverUrl +'/edit/profile/pic', this.image64).pipe().subscribe((data)=>{
        this.storeInfo.loader = false;
        console.log("changed");
        this.uploaded = false;
        this.storeInfo.setImage(data['image']);
      },error =>{
        this.storeInfo.loader = false;
        console.log(error)
      })
    }
  }
  async change(){
    console.log("change pressed")
    if(!this.profileForm.valid){
      this.openSnackBar("Invalid Input","Close")
      return false;
    }
    else{
      this.storeInfo.loader = true;
      this.http.post(this.storeInfo.serverUrl + '/edit/profile',this.profileForm.value).pipe().subscribe((data)=>{
        this.storeInfo.loader = false;
        this.openSnackBar('Profile Updated',"Close")
        
      },error =>{
        this.storeInfo.loader = false;
        this.openSnackBar("Some Error Occured","Close")
        console.log(error)
      })
    }
  }
  compressImage(src, newX, newY) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, newX, newY);
        const data = ctx.canvas.toDataURL();
        res(data);
      }
      img.onerror = error => rej(error);
    })
  }

}
