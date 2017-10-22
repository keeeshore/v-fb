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

	constructor(private apiService: ApiService, private router: Router) {
		console.log('AuthGuard#-----------------------------#constructor:this.isLoggedIn ,', this.isLoggedIn);
		this.apiService = apiService;
		console.log('AuthGaurd::', apiService);
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		console.log('AuthGuard#canActivate called for state.url', state.url, ' isLoggedIn:', this.isLoggedIn);
		if  (state.url === '/login' || state.url === '/' || state.url === '/admin') {
			return true;
		}
		return this.isLoggedIn;	
	}

	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		console.log('AuthGuard#canActivateChild called:this.isLoggedIn ,', this.isLoggedIn);
		//return this.permissions.canActivate(this.currentUser, route.params.id);
		//return false;
	    //return this.canActivate(route, state);
	    if  (state.url === '/login' || state.url === '/') {
			return true;
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
				console.log('checkLoggedInsTate: this.isLoggedIn: after', this.isLoggedIn);
				this.router.navigate(['/admin/events']);
			} else {
				this.isLoggedIn = false;
			}	
		},
		(err:any) => {
			console.log('err response:', err);
			this.isLoggedIn = false;
		});
	}

	public doLogout():void {
		this.isLoggedIn = false;
	}

}