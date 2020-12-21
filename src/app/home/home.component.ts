import { AfterViewInit, Component, OnInit } from '@angular/core';
import { StoreInfoService } from '../services/store-info.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HostListener } from '@angular/core';
import {FormControl} from '@angular/forms';
import { min } from 'rxjs/operators';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  disabled = false;
  color = "azure";
  constructor(
    private storeInfo : StoreInfoService,
    private router : Router,
    private http : HttpClient
  ) { }
  ngOnInit(){
    if(this.storeInfo.isSignedIn){
      this.setDat();
    }
  }
  setDat(){
    this.http.get(this.storeInfo.serverUrl+'/profile').pipe().subscribe((data)=>{
      this.storeInfo.setImage(data['image'])
    },error =>{
      console.log(error)
    })
  }
}
