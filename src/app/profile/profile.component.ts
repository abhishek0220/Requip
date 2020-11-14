import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StoreInfoService } from '../services/store-info.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userid : string;
  username: string;
  name: string;
  email: string;
  about: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    public storeInfo: StoreInfoService,
    private router: Router
  ) { }

  ngOnInit(){
    this.userid = this.activatedRoute.snapshot.paramMap.get('userid').toString();
    this.http.get(this.storeInfo.serverUrl + '/profile/' + this.userid).subscribe((response)=>{
      if(!response['message']){
        console.log(response)
        this.name = response['name'];
        this.username = this.userid;
        this.email = response['email'];
        this.about = response['about'];
      }
    },error=>{
      console.log('error')
    })
  }
}
