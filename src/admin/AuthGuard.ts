import { Injectable }     from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot,
  RouterStateSnapshot }    from '@angular/router';
import { ApiService} from '../app/ApiService';
import { LoginModel} from './login/Login';
import { ENV} from '../app/environments/environment';
import { Subject, Observable} from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

	public isLoggedIn:string = '';

	public loggedInCookieStr:string = 'PHPSESSID';

	constructor(private apiService: ApiService, private router: Router) {
		this.apiService = apiService;
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
		this.isLoggedIn = this.getCookie(this.loggedInCookieStr);
		console.log('AuthGuard#--------#canActivate getCookie:', this.getCookie(this.loggedInCookieStr), ', state.url :', state.url, ' , this.isLoggedIn:', this.isLoggedIn);		
		console.log('AuthGuard#--------#canActivate getCookie: RETURN:', this.isLoggedIn === '');		
		if  (state.url !== '/admin' && !this.isLoggedIn) {
			console.log('state url is not /admin but a child>navigate to LOGIN');
			this.router.navigate(['/admin']);
			return true;
		}
		return true;
	}

	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {		
		this.isLoggedIn = this.getCookie(this.loggedInCookieStr);
		console.log('AuthGuard#--------#canActivateChild called:this.isLoggedIn ,', this.isLoggedIn);
		console.log('AuthGuard#--------#canActivateChild called:this.isLoggedIn return::', this.isLoggedIn === '');
		if  (!this.isLoggedIn || !this.apiService.accessToken) {
			console.log('canActivateChild state url is not /admin-> navigate to LOGIN');
			this.router.navigate(['/admin']);
		}
		//return true;//TEST ONLY
		return this.isLoggedIn !== '';
	}


	public reset():void {
		console.log('AuthGuard#reset before: ', this.loggedInCookieStr);
		this.isLoggedIn = '';
		document.cookie = this.loggedInCookieStr + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path =/;';
		this.isLoggedIn = this.getCookie(this.loggedInCookieStr);
		console.log('AuthGuard#reset after: ', this.isLoggedIn);
	}

	public getCookie(cname:string):string {
	    let name:string = cname + '=';
	    let decodedCookie:string = decodeURIComponent(document.cookie);
	    let ca:string[] = decodedCookie.split(';');
	    for(var i = 0; i <ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
	    return '';
	}

}