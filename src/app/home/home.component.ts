import { Component, OnInit } from '@angular/core';
import { StoreInfoService } from '../services/store-info.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ark = "";

  constructor(
    private storeInfo : StoreInfoService,
    private router : Router,
    private http : HttpClient
  ) { }

  ngOnInit(){
    if(!this.storeInfo.isSignedIn){
      this.router.navigateByUrl('login');
      return;
    }
    this.ark = "loading...";
    this.http.get(this.storeInfo.serverUrl+'/profile').pipe().subscribe((data)=>{
      this.ark = JSON.stringify(data);
    },error =>{
      console.log(error)
    })
  }

}
