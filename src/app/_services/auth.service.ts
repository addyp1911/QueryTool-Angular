import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, pipe, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import { catchError, tap } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL= environment.API_URL;
  private LOGIN_API = this.API_URL + '/api/auth/signin/';
  private AUTH_REFRESH_API = ''

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) { }

  loginUserService(email: string, password: string): Observable<any> {
    return this.http.post(this.LOGIN_API, {
      email,
      password
    }, httpOptions);
  }

  isLoggedIn():boolean {
    let access_token = this.tokenStorageService.getAccessToken()
    return (access_token !== null) ? true : false;
  }

  refreshToken(token: string) {
    return this.http.post(this.AUTH_REFRESH_API, {
      refresh: token
    }, httpOptions);
  }


}
