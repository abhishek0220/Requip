import { Component, OnInit } from '@angular/core';
import { StoreInfoService } from '../services/store-info.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  progress: number;
  infoMessage: any;
  isUploading: boolean = false;
  file: File;
  imageUrl: string;
  fileName: string = "No file selected";
  uploaded = false;
  image64: string;
  constructor(
    private storeInfo : StoreInfoService,
    private router : Router,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.image64 = "";
    this.imageUrl = `${this.storeInfo.serverUrl}/static/users/${this.storeInfo.userid}/user.png`
  }
  onChange(file: File) {
    this.uploaded = false;
    if (file) {
      console.log(file);
      this.fileName = file.name;
      this.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        this.compressImage(reader.result, 400,400).then((compressed : string) => {
          console.log(compressed.length);
          this.imageUrl = compressed;
          this.image64 = compressed;
          this.uploaded = true;
        })
      };
    }
  }

  upload() {
    if(this.uploaded){
      this.http.post(this.storeInfo.serverUrl +'/edit/profile/pic', this.image64).pipe().subscribe((data)=>{
        console.log("changed");
        this.uploaded = false;
      },error =>{
        console.log(error)
      })
    }
  }
  compressImage(src, newX, newY) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, newX, newY);
        const data = ctx.canvas.toDataURL();
        res(data);
      }
      img.onerror = error => rej(error);
    })
  }

}
