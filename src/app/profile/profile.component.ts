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
  image:string;
  ownProfile : boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    public storeInfo: StoreInfoService,
    private router: Router
  ) { }

  ngOnInit(){
    this.activatedRoute.params.subscribe(params => {
      this.userid = params['userid'];
      this.initialiseState(); // reset and set based on new parameter this time
    });
    
  }
  initialiseState(){
    this.username = "";
    this.name = "";
    this.email = "";
    this.about = "";
    this.image = "";
    this.ownProfile = false;
    if(this.userid == this.storeInfo.userid) this.ownProfile = true;
    this.http.get(this.storeInfo.serverUrl + '/profile/' + this.userid).subscribe((response)=>{
      if(!response['message']){
        console.log(response)
        this.name = response['name'];
        this.username = this.userid;
        this.email = response['email'];
        this.about = response['about'];
        this.image = response['image'];
      }
    },error=>{
      console.log('error')
    })
  }
  gotoEdit(){
    return this.router.navigateByUrl('edit/profile');
  }
}
