import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { StoreInfoService } from './store-info.service';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { switchMap, filter, take, catchError } from 'rxjs/operators';
import { Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenIntercepterService implements HttpInterceptor {
  private refreshingInProgress: boolean;
  private accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  constructor(
    private storeInfo : StoreInfoService,
    private router : Router,
    private authService : AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.storeInfo.getToken();
    return next.handle(this.addAuthorizationHeader(req, accessToken)).pipe(
                catchError(err => {
                if (err instanceof HttpErrorResponse && err.status === 401) {
                  const refreshToken = this.storeInfo.getRefreshToken();
                  if (refreshToken != null && refreshToken !== undefined) {
                    return this.refreshToken(req, next);
                  }
                  else
                    return this.logoutAndRedirect(err);
                }
                else if (err instanceof HttpErrorResponse && err.status === 403) {
                  return this.logoutAndRedirect(err);
                }
                return throwError(err);
              })
          );
  }

  addAuthorizationHeader(request: HttpRequest<any>, token): HttpRequest<any> {
    if (token != null && token != 'undefined') {
      if(request.headers.get('Authorization') == null){
        return request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
      }
     
    } 
    return request;
  }

  logoutAndRedirect(err): Observable<HttpEvent<any>> {
    this.storeInfo.signOut();
    this.router.navigateByUrl('/');
    return throwError(err);
  }
  
  private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.refreshingInProgress) {
      this.refreshingInProgress = true;
      this.accessTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((res) => {
          this.refreshingInProgress = false;
          this.accessTokenSubject.next(res['access_token']);
          return next.handle(this.addAuthorizationHeader(request, res['access_token']));
        })
      );
    } else {
      return this.accessTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          return next.handle(this.addAuthorizationHeader(request, token));
        }));
    }
  }
}
