/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, OnInit, isDevMode} from '@angular/core';
import {ApiService} from './../../ApiService';
import {PagingData, Cursors} from '../model/PagingData';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import { ENV } from '../../environments/environment';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.html',
	providers: [ApiService]
})

export class Login implements OnInit {

	public userName:string;

	public password:string;

	public hostApi:string = ENV.HOST_API_URL;

	public _REASON:string = 'Session Expired. Please login again.';

	public reason:string = '';

	constructor(private apiService: ApiService,  private router: ActivatedRoute) {
		console.log('Photos component init');
	}

	ngOnInit () {
		console.log( process.env.ENV, ' ::: ENV VARS::', ENV);
		this.reason = '';
		this.router.params.forEach((params: Params) => {
	    	if (params['reason']) {
	    		this.reason = this._REASON;
	    	}
	    });
	}

	public onLoginClick () {
		console.log('onLoginClick');
		document.forms[0].submit();
	}


	public onLoginTest () {
		console.log('onLoginTest');
		let url = ENV.HOST_URL + '/events_get.php';
		let loginModel = new LoginModel(this.userName, this.password);
		this.apiService.fetch(url).subscribe((response:any) => {
			console.log('events_get get  response recieved....', response);
			if (response && response.success) {
				
			}
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