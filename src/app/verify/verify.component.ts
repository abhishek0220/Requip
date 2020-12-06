import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreInfoService }  from '../services/store-info.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  user : string;
  token : string;
  verf_status : String = "Wait...";
  constructor(
    private http: HttpClient,
    private storeInfo: StoreInfoService,
    private router: Router,
    private location : Location,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(){
    if(this.storeInfo.isSignedIn){
      this.router.navigateByUrl('');
      return;
    }
    this.user = this.activatedRoute.snapshot.paramMap.get('_id').toString();
    this.token = this.activatedRoute.snapshot.paramMap.get('token').toString();
    this.location.go('/verify')
    this.verf_status = "Verifying...";
    var par_obj = {
      'token' : this.token,
    }
    this.http.post(this.storeInfo.serverUrl + '/verify/' + this.user, par_obj).pipe().subscribe((data)=>{
      this.verf_status = data["message"] + " Redirecting in 5 sec..";
      setTimeout(() => {
          this.router.navigate(['/']);
      }, 5000);
    },error =>{
      console.log(error)
      this.verf_status = error['statusText'];
    })
  }

}
