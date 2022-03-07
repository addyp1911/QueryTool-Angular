import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { TokenStorageService } from "../_services/token-storage.service";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private tokenStorageService: TokenStorageService) { }
    canActivate(): boolean  {
      let user=this.tokenStorageService.getAccessToken()
      if(user && user!=null){
        return true;
      }
      else{
        this.router.navigateByUrl('/login');
        return false;
      }
    }
}
