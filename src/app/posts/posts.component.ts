import {Component, OnInit } from '@angular/core';
import { StoreInfoService } from '../services/store-info.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HostListener } from '@angular/core';
import {FormControl} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  task: Task = {
    name: 'All',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Books', completed: false, color: 'primary'},
      {name: 'Notes', completed: false, color: 'primary'},
      {name: 'Papers', completed: false, color: 'primary'},
      {name: 'Others', completed: false, color: 'primary'}
    ]
  };
  allComplete: boolean = false;
  showFilter=true;
  ark = "";
  items = [];
  allitems = [];
  lastGet  = 0;
  isAvailable = true;
  running = false;
  filterVal = new FormControl();
  objType = new FormControl();
  queryTo = '';
  constructor(
    private storeInfo : StoreInfoService,
    private router : Router,
    private http : HttpClient
  ) { }
  ngOnInit(){
    this.objType.setValue('all');
    this.filterVal.setValue('');
    this.setAll(true);
    this.createQuery(false);
    this.getItems(`?type=${this.queryTo}`); 
  }
  
  createQuery(run = true){
    var quer = '';
    this.task.subtasks.forEach( t => {
      if(t.completed) quer = quer + t.name.toLowerCase() + ',';
    })
    quer = quer.substr(0, quer.length -1);
    //console.log(quer);
    this.queryTo = quer;
    if(run) this.filterVia();
    if(window.innerWidth <= 600){
      this.showFilter = false;
    }
  }

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }
  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }
  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
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
  getItems(quer:string = "", loader = false){
    console.log(quer)
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
    this.isAvailable = true;
    if(this.allitems.length == this.items.length)
      this.isAvailable = false;
  }
  open(postID){
    this.router.navigateByUrl('/post/'+postID)
  }
  filterVia(){
    var quer = this.filterVal.value;
    var objT = this.queryTo;
    if(quer != "")
      quer = `?text=${quer}&type=${objT}`
    else
      quer = `?type=${objT}`
    this.getItems(quer, true);
  }
}
