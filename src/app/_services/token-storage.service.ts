import { Injectable } from '@angular/core';

const ACCESSTOKEN_KEY = 'auth-accesstoken';
const USER_KEY = 'auth-user';
const REFRESHTOKEN_KEY = ''


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveAccessToken(token: string): void {
    window.sessionStorage.removeItem(ACCESSTOKEN_KEY);
    window.sessionStorage.setItem(ACCESSTOKEN_KEY, token);

    const user = this.getUser();
    if (user.id) {
      this.saveUser({ ...user, accessToken: token });
    }
  }

  public getAccessToken(): string | null {
    return window.sessionStorage.getItem(ACCESSTOKEN_KEY);
  }

  public saveRefreshToken(token: string): void {
    window.sessionStorage.removeItem(REFRESHTOKEN_KEY);
    window.sessionStorage.setItem(REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(REFRESHTOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): {'email': string, 'id': string, 'username': string, 'department': string} {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {'email': '', 'id':'', 'username':'', 'department':''};
  }

  public getUserIsAdmin(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      let userData = JSON.parse(user);
      if (userData.roles.indexOf('ADMIN') !== -1){
        return true;
      }
      else{
        return false;
      }
    } else {
      return false;
    }
  }


  public getUserIsCoordinator(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      let userData = JSON.parse(user);
      if (userData.roles.indexOf('COORDINATOR') !== -1){
        return true;
      }
      else{
        return false;
      }
    } else {
      return false;
    }
  }


  public getUserIsRequester(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      let userData = JSON.parse(user);
      if (userData.roles.indexOf('REQUESTER') !== -1){
        return true;
      }
      else{
        return false;
      }
    } else {
      return false;
    }
  }

  public getUserIsResolver(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      let userData = JSON.parse(user);
      if (userData.roles.indexOf('RESOLVER') !== -1){
        return true;
      }
      else{
        return false;
      }
    } else {
      return false;
    }
  }

}
