/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList, OnInit, isDevMode} from '@angular/core';
import {ApiService} from './../ApiService';
import {PagingData, Cursors} from '../model/PagingData';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";
import { ENV } from '../environments/environment';

@Component({
	selector: 'app-login',
	templateUrl: './login.html',
	providers: [ApiService]
})

export class Login implements OnInit {

	public userName:string;

	public password:string;


	constructor(private apiService: ApiService) {
		console.log('Login component init:URL:', ENV);
	}

	ngOnInit () {
		console.log('process::', process);
		//console.log('__IN_DEBUG__::', API_URL);
		if (isDevMode()) {
	      console.log('MODE: Development!');
	    } else {
	      console.log('MODE: Production!');
	    }
	}

	public onLoginClick () {
		console.log('onLoginClick');
		document.forms[0].submit();
	}


	public onLoginTest () {
		console.log('onLoginTest');
		let url = ENV.HOST_URL + '/api/events_get.php';
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
