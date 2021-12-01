import { UserService } from './../../shared/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService : UserService,private router : Router){}

  serverErrorMessages: any;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (!this.userService.isLoggedIn()) {
        this.router.navigate(['/auth/signin']);
        this.userService.deleteToken();
        return false;
      }
      
    return true;
  }
  
}
