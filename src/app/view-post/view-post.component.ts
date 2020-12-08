import { Component, OnInit, Inject} from '@angular/core';
import { StoreInfoService } from '../services/store-info.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {
  postID = "";
  post :object;
  suggestion = [];

  constructor(
    private storeInfo : StoreInfoService,
    private router : Router,
    private http: HttpClient,
    public fb: FormBuilder,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
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
    window.scrollTo(0, 0);
    this.http.get(this.storeInfo.serverUrl+'/saman/'+this.postID).pipe().subscribe((data : object)=>{
      this.post  = data;
      var obj = "";
      obj = data['tags'].join(" ") + " " +data['title'];
      this.getSuggestion(obj, data['type'])
    },error =>{
      this.openSnackBar('Some Error Occured','Close')
    })
  }
  gotoProfile(){
    this.router.navigateByUrl('profile/'+this.post['username']);
  }
  getSuggestion(quer, catag){
    this.http.get(`${this.storeInfo.serverUrl}/saman?text=${quer}&type=${catag}&limit=4`).pipe().subscribe((data : [])=>{
      this.suggestion = []
      data.forEach((element) => {
        if(element['_id']!=this.postID) this.suggestion.push(element)
      })
    },error =>{
      console.log(error)
    })
  }
  open(postID){
    this.router.navigate(['/post/' + postID]);
    //this.router.navigateByUrl('/post/'+postID)
  }
  gotoEdit(){
    this.router.navigateByUrl('edit/post/'+this.postID);
  }
  openDialog() {
    this.dialog.open(DialogElementsExampleDialog, {
      data: this.postID
    });
  }
}
@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'dialog-elements-example-dialog.html',
  styleUrls: ['./dialog-elements-example-dialog.css']
})
export class DialogElementsExampleDialog {
  reportForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogElementsExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public postID: string,
    public fb: FormBuilder,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private storeInfo : StoreInfoService,
  ){
    this.mainForm()
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  mainForm() {
    this.reportForm = this.fb.group({
      reason: ['', [Validators.required]],
    })
  }
  report(){
    if(!this.reportForm.valid){
      this.openSnackBar("Invalid Input","Close")
      return false;
    }
    else{
      this.http.post(this.storeInfo.serverUrl + '/flag/' + this.postID,this.reportForm.value).pipe().subscribe((data)=>{
        this.openSnackBar(data['message'],"Close")
        this.dialogRef.close()
      },error =>{
        this.openSnackBar("Some Error Occured","Close")
        console.log(error)
        this.dialogRef.close()
      })
    }
  }
}
