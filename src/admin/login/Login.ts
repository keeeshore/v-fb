/**
 * Created by balank on 8/09/2017.
 */
import { Component,  ViewChildren, QueryList, OnInit, isDevMode } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ApiService } from './../../app/ApiService';
import { AuthGuard } from './../AuthGuard';
import { PagingData, Cursors } from '../model/PagingData';
import * as moment from 'moment';
import { Subject, Observable } from "rxjs";
import { ENV } from '../../app/environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.html',
	providers: []
})

export class Login implements OnInit {

	public userName:string;

	public password:string;

	public hostApi:string = ENV.HOST_API_URL;

	public hostUrl:string = ENV.HOST_URL;

	public _REASON:string = 'Session Expired. Please login again.';

	public reason:string = '';

	public facebook:string = '';

	constructor(
		private apiService: ApiService, 
		public authGaurd: AuthGuard, 
		private route: Router,
		private router: ActivatedRoute) {
		console.log('Login component init::AuthGuard', authGaurd);
	}

	ngOnInit () {
		//console.log( process.env.ENV, ' ::: ENV VARS::', ENV, ':::authGaurd:::', this.authGaurd);
		this.authGaurd.reset();
		this.apiService.insertGoogleCaptha();
		this.apiService.insertFBSDK();
		this.reason = '';
		this.router.params.forEach((params: Params) => {
	    	if (params['error']) {
	    		this.reason = this._REASON;
	    	}
	    });
	}

	public onLoginClick () {
		console.log('onLoginClick::login to FB');
		
		//window.FB.login();
		FB.getLoginStatus((response:any) => {
			if (response.status === 'connected') {
				// Logged into your app and Facebook.
				this.apiService.accessToken = response.authResponse.accessToken;
				console.log('Logged in, form submit()');
				//document.forms[0].submit();
				this.doLogin();

			} else {
				console.log('Not logged in..');
				FB.login((response:any) => {
					debugger;
					console.log('Logged in during formSubmit::response::', response);
					if (response.authResponse) {				    	
				    	this.apiService.accessToken = response.authResponse.accessToken;				    	
						this.doLogin();
				    } else {
				     	this.reason = 'User cancelled login or did not fully authorize.';
				    }
				}, {scope: 'publish_actions'});
			}
	    });
		
		//document.forms[0].submit();
		//let loginModel = new LoginModel(this.userName, this.password);
		//this.authGaurd.doLogin(loginModel);
	}

	public onLoginClick1 () {
		//console.log('onLoginClick---------ajax');
		let loginModel = new LoginModel(this.userName, this.password);
		this.authGaurd.doLogin(loginModel);
	}

	public doLogin () {
		debugger;
		let url = 'https://ux0ta12z3a.execute-api.ap-southeast-2.amazonaws.com/prod/login';
		let postData:any = {
			userName: this.userName,
			password: this.password,
			recapthca: document.forms[0].elements['g-recaptcha-response'].value
		};
		this.apiService.post(url, postData).subscribe((response:any) => {
			console.log('LoginSubmit:: POST response SUCCESS....', response);
			if (response && response.success) {
				this.route.navigate(['/admin/update-all']);
			} else {
				this.reason = response.message;
			}
		},
		(err:any) => {
			console.log('LoginSubmit:: POST response err....', err);
		});
	}


}

const apiUrl = process.env.API_URL;

export class LoginModel {

	public userName:string;

	public password:string;

	constructor(userName:string, password:string) {
		console.log('Login component init');
		this.userName = userName;
		this.password = password;
	}
}
