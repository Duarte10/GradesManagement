import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // get access token
        const token = this.auth.getAccessToken();

        // add api url
        request = request.clone({
            url: environment.apiUrl + request.url,
            headers: request.headers.append('Authorization', 'Bearer ' + token)
        });

        return next.handle(request);
    }
}
