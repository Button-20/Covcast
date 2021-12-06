import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from '../../shared/user.service';

@Injectable({
  providedIn: 'root'
})
export class RestrictGuard implements CanActivate {

  constructor(private userService : UserService,private router : Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      var payload = this.userService.getUserPayload();
      if (payload && payload.role !== 'Admin') {
        alert('You are not allow to access this route.')
        this.router.navigate(['/auth/signin']);
        return false;
      }

    return true;
  }
  
}
