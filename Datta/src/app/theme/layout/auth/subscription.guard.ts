import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from '../../shared/user.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionGuard implements CanActivate {
  subscription: boolean = false;

  constructor(private userService : UserService,private router : Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      var payload = this.userService.getUserPayload();
      if (payload && payload.subscription !== 'Premium Plan') {
        alert('You are not allow to access this route. For Premium Users Only')
        this.router.navigate(['/dashboard/default']);
        return false;
      }

    return true;
  }
  
}
