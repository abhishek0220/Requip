import { Component, OnInit } from '@angular/core';
import { StoreInfoService } from '../services/store-info.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {
  postID = "";
  post :object;

  constructor(
    private storeInfo : StoreInfoService,
    private router : Router,
    private http: HttpClient,
    public fb: FormBuilder,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(){
    this.activatedRoute.params.subscribe(params => {
      this.postID = params['postID'];
      this.initialiseState(); // reset and set based on new parameter this time
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  initialiseState(){
    this.http.get(this.storeInfo.serverUrl+'/saman/'+this.postID).pipe().subscribe((data)=>{
      this.post = data;
    },error =>{
      this.openSnackBar('Some Error Occured','Close')
    })
  }
  gotoEdit(){
    this.router.navigateByUrl('edit/post/'+this.postID);
  }
}
