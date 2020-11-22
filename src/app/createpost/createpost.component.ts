import { Component, OnInit } from '@angular/core';
import { StoreInfoService } from '../services/store-info.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-createpost',
  templateUrl: './createpost.component.html',
  styleUrls: ['./createpost.component.css']
})
export class CreatepostComponent implements OnInit {
  file: File;
  imageUrl = "";
  fileName: string;
  productForm: FormGroup;
  isImage = false;
  constructor(
    private storeInfo : StoreInfoService,
    private router : Router,
    private http: HttpClient,
    public fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(){
    if(!this.storeInfo.isSignedIn){
      this.router.navigateByUrl('login');
      return;
    }
    this.mainForm();
  }
  onChange(file: File) {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        var img = new Image();
        img.onload = () => {
          var width = img.width;
          var height = img.height;
          var maxDim = 720;
          console.log("99",height,width)
          if(width > maxDim || height > maxDim){
            if(height > width){
              width = (width*maxDim)/height;
              height = maxDim;
            }
            else{
              height = (height * maxDim)/ width;
              width = maxDim;
            }
          }
          this.compressImage(reader.result, width, height).then((compressed : string) => {
            this.imageUrl = compressed;   
            this.isImage = true;
            this.productForm.controls['image'].setValue(compressed); 
          })

        }
        img.src = reader.result.toString();
      };
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  mainForm() {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required]],
      price: ['0', Validators.pattern('^[0-9]*$')],
      phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[6-9]{1}?[0-9]{9}$')]],
      moneytized: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: ['']
    })
  }
  upload(){
    if(!this.productForm.valid){
      this.openSnackBar("Invalid Input","Close")
      return false;
    }
    else if(this.imageUrl == ""){
      this.openSnackBar("Please Select Image","Close")
      return false;
    }
    else{
      this.storeInfo.loader = true;
      this.http.post(this.storeInfo.serverUrl + '/add',this.productForm.value).pipe().subscribe((data)=>{
        this.storeInfo.loader = false;
        this.openSnackBar('Object Added',"Close")
        this.router.navigateByUrl('/');
        
      },error =>{
        this.storeInfo.loader = false;
        this.openSnackBar("Some Error Occured","Close")
        console.log(error)
      })
    }
  }
  compressImage(src, newX, newY) {
    console.log("here",newX,newY)
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
