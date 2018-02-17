import { Injectable }     from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot,
  RouterStateSnapshot }    from '@angular/router';
import { ApiService} from '../app/ApiService';
import { LoginModel} from './login/Login';
import { ENV} from '../app/environments/environment';
import { Subject, Observable} from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

	public isLoggedIn:boolean = false;

	public loggedInCookieStr:string = 'PHPSESSID';

	constructor(private apiService: ApiService, private router: Router) {
		this.apiService = apiService;
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
		this.isLoggedIn = this.getCookie(this.loggedInCookieStr) !== '';
		console.log('AuthGuard#--------#canActivate getCookie:', this.getCookie(this.loggedInCookieStr), ', state.url :', state.url, ' , this.isLoggedIn:', this.isLoggedIn);
		
		if  (state.url !== '/admin' && !this.isLoggedIn) {
			console.log('state url is not /admin but a child');
			this.router.navigate(['/admin']);
		}
		return true;
	}

	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {		
		this.isLoggedIn = this.getCookie(this.loggedInCookieStr) !== '';
		console.log('AuthGuard#--------#canActivateChild called:this.isLoggedIn ,', this.isLoggedIn);
		if  (!this.isLoggedIn) {
			console.log('canActivateChild state url is not /admin-> navigate to admin');
			this.router.navigate(['/admin']);
		}
		return this.isLoggedIn;	
	}

	public doLogin(loginModel:LoginModel):void {
		let url = ENV.HOST_API_URL + '/authorize.php';

		this.apiService.post(url, loginModel).subscribe((response:any) => {
			console.log('checkLoggedInsTate: response');
			if (response.success) {
				console.log('checkLoggedInsTate: this.isLoggedIn: before', this.isLoggedIn);
				this.isLoggedIn = true;
				document.cookie = this.loggedInCookieStr +'='+ this.isLoggedIn +';';
				console.log('checkLoggedInsTate: this.isLoggedIn: after', this.isLoggedIn);
				this.router.navigate(['/admin/events']);
			} else {
				this.reset();
			}
		},
		(err:any) => {
			console.log('err response:', err);
			this.isLoggedIn = false;
		});
	}

	public reset():void {
		console.log('AuthGuard#reset before: ', this.isLoggedIn);
		this.isLoggedIn = false;
		document.cookie = this.loggedInCookieStr + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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