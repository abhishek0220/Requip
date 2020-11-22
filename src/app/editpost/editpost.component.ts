import { Component, OnInit } from '@angular/core';
import { StoreInfoService } from '../services/store-info.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styleUrls: ['./editpost.component.css']
})
export class EditpostComponent implements OnInit {
  postForm: FormGroup;
  postID = "";
  imageUrl = "";
  constructor(
    private storeInfo : StoreInfoService,
    private router : Router,
    private http: HttpClient,
    public fb: FormBuilder,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(){
    this.mainForm();
    this.activatedRoute.params.subscribe(params => {
      this.postID = params['postID'];
      this.initialiseState(); // reset and set based on new parameter this time
    });
  }
  mainForm() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required]],
      price: ['0', Validators.pattern('^[0-9]*$')],
      phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[6-9]{1}?[0-9]{9}$')]],
      moneytized: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: ['']
    })
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  initialiseState(){
    this.http.get(this.storeInfo.serverUrl+'/saman/'+this.postID).pipe().subscribe((data)=>{
      this.postForm.controls['title'].setValue(data['title']);
      this.postForm.controls['type'].setValue(data['type']);
      this.postForm.controls['price'].setValue(data['price']);
      this.postForm.controls['phone'].setValue(data['phone']);
      this.postForm.controls['moneytized'].setValue(data['moneytized']);
      this.postForm.controls['description'].setValue(data['description']);
      this.imageUrl = `${this.storeInfo.mediaServer}/${data['images']}`
    },error =>{
      this.openSnackBar('Some Error Occured','Close')
    })
  }
  upload(){
    console.log("add pressed")
    if(!this.postForm.valid){
      this.openSnackBar("Invalid Input","Close")
      return false;
    }
    else{
      this.storeInfo.loader = true;
      this.http.post(this.storeInfo.serverUrl + '/saman/'+this.postID,this.postForm.value).pipe().subscribe((data)=>{
        this.storeInfo.loader = false;
        this.openSnackBar('Object Edited',"Close")
      },error =>{
        this.storeInfo.loader = false;
        this.openSnackBar("Some Error Occured","Close")
        console.log(error)
      })
    }
  }
  delete(){
    this.http.delete(this.storeInfo.serverUrl + '/saman/'+this.postID,this.postForm.value).pipe().subscribe((data)=>{
      this.storeInfo.loader = false;
      this.openSnackBar('Deleted',"Close")
      this.router.navigateByUrl('/')
    },error =>{
      this.storeInfo.loader = false;
      this.openSnackBar("Some Error Occured","Close")
      console.log(error)
    })
  }

}
