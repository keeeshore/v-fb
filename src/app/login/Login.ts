/**
 * Created by balank on 8/09/2017.
 */
import {Component,  ViewChildren, QueryList} from '@angular/core';
import {ApiService} from './../ApiService';
import {PagingData, Cursors} from '../model/PagingData';
import * as moment from 'moment';
import {Subject, Observable} from "rxjs";

@Component({
	selector: 'app-login',
	templateUrl: './login.html',
	providers: [ApiService]
})

export class Login {

	public userName:string;

	public password:string;

	constructor(private apiService: ApiService) {
		console.log('Login component init');
	}

	public onLoginClick () {
		console.log('onLoginClick');
		let url = 'http://localhost/vimonisha/api/authorize.php';
		let loginModel = new LoginModel(this.userName, this.password);
		this.apiService.post(url, loginModel).subscribe((response:any) => {
			console.log('loginModel POST response recieved....', response);
			if (response && response.success) {
				
			}
		});
	}
	

}

export class LoginModel {

	public userName:string;

	public password:string;

	constructor(userName:string, password:string) {
		console.log('Login component init');
		this.userName = userName;
		this.password = password;
	}
}
