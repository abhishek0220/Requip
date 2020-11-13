import { Component } from '@angular/core';
import { StoreInfoService }  from './services/store-info.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Requip';
  constructor(
    public storeInfo: StoreInfoService,
    private router: Router
  ){}

  logout(){
    this.storeInfo.signOut();
    return this.router.navigateByUrl('login');
  }
}
