import { Component, OnInit , ViewChild, ViewEncapsulation, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StoreInfoService }  from '../services/store-info.service';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {QrScannerComponent} from 'angular2-qrscanner';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  idng :string;
  scannerEnabled = false;
  constructor(
    public fb: FormBuilder,
    private http: HttpClient,
    private storeInfo: StoreInfoService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
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
  async login(userother = false, qr = ''){
    console.log("login press", this.storeInfo.isSignedIn)
    if(userother == true){
      this.storeInfo.loader = true;
      this.http.post(this.storeInfo.serverUrl + '/login?use=twq',{'response_qr': qr}).pipe().subscribe((data)=>{
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
    else if(!this.loginForm.valid){
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

  openDialog() {
    const dialogRef = this.dialog.open(LoginDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog qr: ${result['qr']}`);
      console.log(`Dialog token: ${result['token']}`);
      if(result['token'] == '' || result['qr'] == '') return;
      else{
        let resqr = result['token'] + ',' + result['qr']
        this.login(true, resqr)
      }

    });
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    return;
  }
  alter(){
    this.scannerEnabled = !this.scannerEnabled;
  }

}

@Component({
  selector: 'two-way-qr',
  templateUrl: 'two_way_qr.html',
  styleUrls: ['./twq.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginDialog implements OnInit{
  TWQ_EP = ""
  progress = true
  qr = 'hello';
  token = '';
  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent ;
  constructor(
    private http: HttpClient,
    private storeInfo: StoreInfoService,
    private dialogRef: MatDialogRef<LoginComponent>
  ) {}
  ngOnInit(){
    this.getqr()
    //this.progress = false
  }
  getqr(){
    this.http.get(this.storeInfo.serverUrl + '/auth-id?scopes=email').pipe().subscribe((data)=>{
      this.qr = data['qr']
      this.token = data['token']
      this.progress = false
      console.log(this.qr, this.token)
      this.startresp()
    },error =>{
      console.log(error)
    })
  }
  startresp(){
    this.qrScannerComponent.getMediaDevices().then(devices => {
      console.log(devices);
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
          if (device.kind.toString() === 'videoinput') {
              videoDevices.push(device);
          }
      }
      if (videoDevices.length > 0){
          let choosenDev;
          for (const dev of videoDevices){
              if (dev.label.includes('front')){
                  choosenDev = dev;
                  break;
              }
          }
          if (choosenDev) {
              this.qrScannerComponent.chooseCamera.next(choosenDev);
          } else {
              this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
          }
        }
    });
    this.qrScannerComponent.capturedQr.subscribe(result => {
      this.dialogRef.close({
        'qr': result || '',
        'token': this.token || ''
      });
    });
  }
}
