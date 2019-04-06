import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Injectable} from '@angular/core';

import {ToastrManager} from 'ng6-toastr-notifications';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
   constructor(private toastr: ToastrManager) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          this.toastr.errorToastr(errorMessage, 'Error', {
            toastTimeout: 20000,
            newestOnTop: true,
            showCloseButton: true
          });
          return throwError(errorMessage);
        })
      )
  }
}
