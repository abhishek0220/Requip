import { AfterViewInit, Component, OnInit } from '@angular/core';
import { StoreInfoService } from '../services/store-info.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ark = "";
  items = [];
  lastGet  = 0;
  isAvailable = true;
  constructor(
    private storeInfo : StoreInfoService,
    private router : Router,
    private http : HttpClient
  ) { }

  ngOnInit(){
    if(this.storeInfo.isSignedIn){
      this.setDat();
    }
    this.getItems(); 
  }
  @HostListener("window:scroll", [])
  onScroll(): void {
    if ( this.isAvailable && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if(Date.now() - this.lastGet >= 1000){
        this.lastGet = Date.now();
        console.log("hhh");
        this.getItems(this.items.length, true);
      }  
    }
  }
  setDat(){
    this.http.get(this.storeInfo.serverUrl+'/profile').pipe().subscribe((data)=>{
      this.storeInfo.setImage(data['image'])
    },error =>{
      console.log(error)
    })
  }
  getItems(skip = 0, anim = false){
    if(anim) this.storeInfo.toggleLoader()
    this.http.get(`${this.storeInfo.serverUrl}/saman?skip=${skip}`).pipe().subscribe((data)=>{
      var con = false;
      for(var a in data){
        con = true;
        this.items.push(data[a]);
      }
      if(!con) this.isAvailable = false;
      this.lastGet = Date.now();
      if(anim) this.storeInfo.toggleLoader()
    },error =>{
      console.log(error)
    })
  }
  open(postID){
    this.router.navigateByUrl('/post/'+postID)
  }

}
