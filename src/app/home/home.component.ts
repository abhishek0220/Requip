import { AfterViewInit, Component, OnInit } from '@angular/core';
import { StoreInfoService } from '../services/store-info.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HostListener } from '@angular/core';
import {FormControl} from '@angular/forms';
import { min } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ark = "";
  items = [];
  allitems = [];
  lastGet  = 0;
  isAvailable = true;
  running = false;
  filterVal = new FormControl();
  objType = new FormControl();
  constructor(
    private storeInfo : StoreInfoService,
    private router : Router,
    private http : HttpClient
  ) { }

  ngOnInit(){
    this.objType.setValue('all');
    this.filterVal.setValue('');
    if(this.storeInfo.isSignedIn){
      this.setDat();
    }
    this.getItems(); 
  }
  @HostListener("window:scroll", [])

  onScroll(){
    if (!this.running && this.isAvailable && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      if(Date.now() - this.lastGet >= 1000){
        this.running = true;
        this.storeInfo.toggleLoader();
        setTimeout(() => {
          console.log("getting image");
          this.pushItems();
          this.storeInfo.toggleLoader();
          this.running = false;
        }, 1000);
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
  getItems(quer:string = "", loader = false){
    if(loader) this.storeInfo.toggleLoader();
    this.http.get(`${this.storeInfo.serverUrl}/saman${quer}`).pipe().subscribe((data)=>{
      this.allitems = [];
      for(var a in data){
        this.allitems.push(data[a]);
      }
      this.items = [];
      this.pushItems();
      if(loader) this.storeInfo.toggleLoader();
    },error =>{
      console.log(error)
      if(loader) this.storeInfo.toggleLoader();
    })
  }
  pushItems(){
    var start = this.items.length;
    for(var i=start; i<this.allitems.length && i<start+5; i++ ){
      this.items.push(this.allitems[i]);
    }
    this.lastGet = Date.now();
    if(this.allitems.length == this.items.length)
      this.isAvailable = false;
  }
  open(postID){
    this.router.navigateByUrl('/post/'+postID)
  }
  filterVia(){
    var quer = this.filterVal.value;
    var objT = this.objType.value;
    if(quer != "")
      quer = `?text=${quer}&type=${objT}`
    else
      quer = `?type=${objT}`
    this.getItems(quer, true);
  }

}
