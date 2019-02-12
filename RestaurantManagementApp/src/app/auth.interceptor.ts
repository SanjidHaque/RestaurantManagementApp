
import {tap} from 'rxjs/operators';
import { HttpInterceptor, HttpRequest,
  HttpHandler, HttpUserEvent, HttpEvent } from '@angular/common/http';

import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from './user.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get('No-Auth') === 'True') {
      return next.handle(req.clone());
    }

    if (localStorage.getItem('userToken') != null) {
      const clonedreq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('userToken'))
      });
      return next.handle(clonedreq).pipe(
        tap(
          succ => { },
          err => {
            if (err.status === 401) {
              this.router.navigateByUrl('/login');
            }
            if (err.status === 403) {
              this.router.navigateByUrl('/forbidden');
            }
          }
        ));
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
