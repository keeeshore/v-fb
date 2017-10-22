/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, OnInit, isDevMode} from '@angular/core';
import {ApiService} from './../../app/ApiService';
import {AuthGuard} from './../AuthGuard';
import {PagingData, Cursors} from '../model/PagingData';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
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

	constructor(
		private apiService: ApiService, 
		public authGaurd: AuthGuard, 
		private router: ActivatedRoute) {
		console.log('Photos component init::AuthGuard', authGaurd);
	}

	ngOnInit () {
		console.log( process.env.ENV, ' ::: ENV VARS::', ENV, ':::authGaurd:::', this.authGaurd);
		this.authGaurd.reset();
		this.reason = '';
		this.router.params.forEach((params: Params) => {
	    	if (params['reason']) {
	    		this.reason = this._REASON;
	    	}
	    });
	}

	public onLoginClick () {
		console.log('onLoginClick');
		//document.forms[0].submit();
		let loginModel = new LoginModel(this.userName, this.password);
		this.authGaurd.doLogin(loginModel);
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
